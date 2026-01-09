"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar?: string;
  content: string;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "ESL Student",
    initials: "SJ",
    content:
      "ClarityWeb has been a game-changer for my studies. As a non-native English speaker, I often struggle with academic papers. Now I can understand complex topics much easier!",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "High School Teacher",
    initials: "MC",
    content:
      "I use ClarityWeb to adapt reading materials for students with different reading levels. It saves me hours of work and my students love how accessible the content becomes.",
  },
  {
    id: 3,
    name: "Emma Williams",
    role: "Parent of Dyslexic Child",
    initials: "EW",
    content:
      "The dyslexia-friendly features are wonderful. The OpenDyslexic font option and adjustable text size have made such a difference for my daughter's confidence in reading.",
  },
  {
    id: 4,
    name: "David Martinez",
    role: "Graduate Researcher",
    initials: "DM",
    content:
      "When I need to quickly understand the key points of dense research papers, ClarityWeb's summary mode is incredibly helpful. It gives me a solid foundation before diving into details.",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "Content Creator",
    initials: "LT",
    content:
      "I use ClarityWeb to make my blog posts more accessible to a wider audience. The readability scores help me understand how my content can be improved.",
  },
];

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 5 seconds
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative">
      {/* Main testimonial card */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8 md:p-12">
          <Quote className="h-10 w-10 text-primary/20 mb-6" />

          <blockquote className="text-lg md:text-xl mb-8 leading-relaxed text-foreground/90">
            &ldquo;{currentTestimonial.content}&rdquo;
          </blockquote>

          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              {currentTestimonial.avatar && (
                <AvatarImage
                  src={currentTestimonial.avatar}
                  alt={currentTestimonial.name}
                />
              )}
              <AvatarFallback className="bg-primary/10 text-primary">
                {currentTestimonial.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{currentTestimonial.name}</p>
              <p className="text-sm text-muted-foreground">
                {currentTestimonial.role}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            goToPrevious();
            setIsAutoPlaying(false);
            setTimeout(() => setIsAutoPlaying(true), 5000);
          }}
          className="rounded-full shadow-md bg-background"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            goToNext();
            setIsAutoPlaying(false);
            setTimeout(() => setIsAutoPlaying(true), 5000);
          }}
          className="rounded-full shadow-md bg-background"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              index === currentIndex
                ? "w-6 bg-primary"
                : "w-2 bg-primary/30 hover:bg-primary/50"
            )}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
