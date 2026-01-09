"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Square, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePreferences } from "@/lib/hooks/usePreferences";

interface TextToSpeechProps {
  text: string;
  className?: string;
  showSpeedControl?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  onPause?: () => void;
  onResume?: () => void;
}

export function TextToSpeech({
  text,
  className,
  showSpeedControl = true,
  onStart,
  onEnd,
  onPause,
  onResume,
}: TextToSpeechProps) {
  const { speechRate, updateSpeechRate } = usePreferences();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check browser support and load voices
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setIsSupported(false);
      return;
    }

    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      // Prefer English voices
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

  const speak = useCallback(() => {
    if (!isSupported || !text.trim()) return;

    // Cancel any existing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Use first available voice
    if (voices.length > 0) {
      utterance.voice = voices[0];
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      onStart?.();
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      onEnd?.();
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [text, speechRate, voices, isSupported, onStart, onEnd]);

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
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = newRate;
        if (voices.length > 0) {
          utterance.voice = voices[0];
        }
        utterance.onend = () => {
          setIsPlaying(false);
          setIsPaused(false);
          onEnd?.();
        };
        utteranceRef.current = utterance;
        speechSynthesis.speak(utterance);
      }
    },
    [updateSpeechRate, isPlaying, text, voices, onEnd]
  );

  if (!isSupported) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 text-muted-foreground",
          className
        )}
      >
        <VolumeX className="size-4" />
        <span className="text-sm">Text-to-speech not supported</span>
      </div>
    );
  }

  return (
    <div
      className={cn("flex items-center gap-3", className)}
      role="region"
      aria-label="Text to speech controls"
    >
      {/* Play/Pause Button */}
      <Button
        variant="outline"
        size="icon-sm"
        onClick={togglePlayPause}
        aria-label={isPlaying && !isPaused ? "Pause speech" : "Play speech"}
        disabled={!text.trim()}
      >
        {isPlaying && !isPaused ? (
          <Pause className="size-4" />
        ) : (
          <Play className="size-4" />
        )}
      </Button>

      {/* Stop Button */}
      {isPlaying && (
        <Button
          variant="outline"
          size="icon-sm"
          onClick={stop}
          aria-label="Stop speech"
        >
          <Square className="size-4" />
        </Button>
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
    </div>
  );
}

export default TextToSpeech;
