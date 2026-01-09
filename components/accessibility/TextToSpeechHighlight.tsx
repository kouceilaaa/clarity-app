"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Square, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePreferences } from "@/lib/hooks/usePreferences";

interface Word {
  text: string;
  startIndex: number;
  endIndex: number;
}

interface TextToSpeechHighlightProps {
  text: string;
  className?: string;
  textClassName?: string;
  showSpeedControl?: boolean;
  highlightColor?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onWordChange?: (wordIndex: number) => void;
}

// Parse text into words with their positions
function parseWords(text: string): Word[] {
  const words: Word[] = [];
  const regex = /\S+/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    words.push({
      text: match[0],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    });
  }

  return words;
}

export function TextToSpeechHighlight({
  text,
  className,
  textClassName,
  showSpeedControl = true,
  highlightColor = "bg-yellow-200 dark:bg-yellow-800",
  onStart,
  onEnd,
  onPause,
  onResume,
  onWordChange,
}: TextToSpeechHighlightProps) {
  const { speechRate, updateSpeechRate } = usePreferences();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(-1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  // Parse text into words
  const words = useMemo(() => parseWords(text), [text]);

  // Check browser support and load voices
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setIsSupported(false);
      return;
    }

    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      const englishVoices = availableVoices.filter((voice) =>
        voice.lang.startsWith("en")
      );
      setVoices(englishVoices.length > 0 ? englishVoices : availableVoices);
    };

    loadVoices();
    speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      speechSynthesis.cancel();
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  // Scroll highlighted word into view
  useEffect(() => {
    if (currentWordIndex >= 0 && textContainerRef.current) {
      const highlightedWord = textContainerRef.current.querySelector(
        `[data-word-index="${currentWordIndex}"]`
      );
      if (highlightedWord) {
        highlightedWord.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    }
  }, [currentWordIndex]);

  const speak = useCallback(() => {
    if (!isSupported || !text.trim()) return;

    // Cancel any existing speech
    speechSynthesis.cancel();
    setCurrentWordIndex(-1);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Use first available voice
    if (voices.length > 0) {
      utterance.voice = voices[0];
    }

    // Track word boundaries for highlighting
    utterance.onboundary = (event: SpeechSynthesisEvent) => {
      if (event.name === "word") {
        const charIndex = event.charIndex;
        // Find the word that contains this character index
        const wordIndex = words.findIndex(
          (word) => charIndex >= word.startIndex && charIndex < word.endIndex
        );
        if (wordIndex !== -1) {
          setCurrentWordIndex(wordIndex);
          onWordChange?.(wordIndex);
        }
      }
    };

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setCurrentWordIndex(0);
      onStart?.();
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentWordIndex(-1);
      onEnd?.();
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentWordIndex(-1);
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [
    text,
    speechRate,
    voices,
    isSupported,
    words,
    onStart,
    onEnd,
    onWordChange,
  ]);

  const pause = useCallback(() => {
    if (!isSupported) return;
    speechSynthesis.pause();
    setIsPaused(true);
    onPause?.();
  }, [isSupported, onPause]);

  const resume = useCallback(() => {
    if (!isSupported) return;
    speechSynthesis.resume();
    setIsPaused(false);
    onResume?.();
  }, [isSupported, onResume]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentWordIndex(-1);
    onEnd?.();
  }, [isSupported, onEnd]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying && !isPaused) {
      pause();
    } else if (isPlaying && isPaused) {
      resume();
    } else {
      speak();
    }
  }, [isPlaying, isPaused, pause, resume, speak]);

  const handleSpeedChange = useCallback(
    (value: number[]) => {
      const newRate = value[0];
      updateSpeechRate(newRate);

      // If currently playing, restart with new speed
      if (isPlaying && utteranceRef.current) {
        const currentIdx = currentWordIndex;
        speechSynthesis.cancel();

        // Start from current position
        const remainingText =
          currentIdx >= 0 && currentIdx < words.length
            ? text.substring(words[currentIdx].startIndex)
            : text;

        const utterance = new SpeechSynthesisUtterance(remainingText);
        utterance.rate = newRate;
        if (voices.length > 0) {
          utterance.voice = voices[0];
        }

        // Adjust word tracking for remaining text
        const startOffset = currentIdx >= 0 ? words[currentIdx].startIndex : 0;

        utterance.onboundary = (event: SpeechSynthesisEvent) => {
          if (event.name === "word") {
            const charIndex = event.charIndex + startOffset;
            const wordIndex = words.findIndex(
              (word) =>
                charIndex >= word.startIndex && charIndex < word.endIndex
            );
            if (wordIndex !== -1) {
              setCurrentWordIndex(wordIndex);
              onWordChange?.(wordIndex);
            }
          }
        };

        utterance.onend = () => {
          setIsPlaying(false);
          setIsPaused(false);
          setCurrentWordIndex(-1);
          onEnd?.();
        };

        utteranceRef.current = utterance;
        speechSynthesis.speak(utterance);
      }
    },
    [
      updateSpeechRate,
      isPlaying,
      text,
      voices,
      onEnd,
      currentWordIndex,
      words,
      onWordChange,
    ]
  );

  // Render highlighted text
  const renderHighlightedText = () => {
    if (!isPlaying && currentWordIndex === -1) {
      return <span>{text}</span>;
    }

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    words.forEach((word, index) => {
      // Add text before this word
      if (word.startIndex > lastIndex) {
        elements.push(
          <span key={`space-${index}`}>
            {text.substring(lastIndex, word.startIndex)}
          </span>
        );
      }

      // Add the word with potential highlighting
      const isCurrentWord = index === currentWordIndex;
      elements.push(
        <span
          key={`word-${index}`}
          data-word-index={index}
          className={cn(
            "transition-colors duration-150 rounded px-0.5",
            isCurrentWord && highlightColor
          )}
        >
          {word.text}
        </span>
      );

      lastIndex = word.endIndex;
    });

    // Add any remaining text
    if (lastIndex < text.length) {
      elements.push(<span key="end">{text.substring(lastIndex)}</span>);
    }

    return <>{elements}</>;
  };

  if (!isSupported) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className={cn("flex items-center gap-2 text-muted-foreground")}>
          <VolumeX className="size-4" />
          <span className="text-sm">Text-to-speech not supported</span>
        </div>
        <div className={textClassName}>{text}</div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Controls */}
      <div
        className="flex items-center gap-3"
        role="region"
        aria-label="Text to speech controls"
      >
        {/* Play/Pause Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={togglePlayPause}
              aria-label={
                isPlaying && !isPaused ? "Pause speech" : "Play speech"
              }
              disabled={!text.trim()}
            >
              {isPlaying && !isPaused ? (
                <Pause className="size-4" />
              ) : (
                <Play className="size-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {isPlaying && !isPaused
                ? "Pause reading"
                : isPaused
                ? "Resume reading"
                : "Start reading aloud"}
            </p>
          </TooltipContent>
        </Tooltip>

        {/* Stop Button */}
        {isPlaying && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={stop}
                aria-label="Stop speech"
              >
                <Square className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Stop reading and reset</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Speed Control */}
        {showSpeedControl && (
          <div className="flex items-center gap-2">
            <Volume2 className="size-4 text-muted-foreground" />
            <Slider
              value={[speechRate]}
              onValueChange={handleSpeedChange}
              min={0.5}
              max={2}
              step={0.1}
              className="w-24"
              aria-label="Speech rate"
            />
            <span className="text-xs text-muted-foreground w-8">
              {speechRate.toFixed(1)}x
            </span>
          </div>
        )}

        {/* Progress indicator */}
        {isPlaying && words.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {currentWordIndex + 1} / {words.length} words
          </span>
        )}
      </div>

      {/* Highlighted Text */}
      <div
        ref={textContainerRef}
        className={cn("leading-relaxed whitespace-pre-wrap", textClassName)}
        aria-live="polite"
        aria-atomic="false"
      >
        {renderHighlightedText()}
      </div>
    </div>
  );
}

export default TextToSpeechHighlight;
