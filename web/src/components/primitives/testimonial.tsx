"use client";

import { animate } from "animejs";
import React, { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { TestimonialAuthor, TestimonialCard } from "../ui/testimonial-card";
import { titleFont } from "@/app/fonts";

interface TestimonialsSectionProps {
  className?: string;
  description: string;
  testimonials: {
    author: TestimonialAuthor;
    href?: string;
    text: string;
  }[];
}

export function TestimonialsSection({
  className,
  description,
  testimonials,
}: TestimonialsSectionProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<null | ReturnType<typeof animate>>(null);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    if (!marqueeRef.current) return;

    // Calculate total width for accurate animation
    const marqueeElement = marqueeRef.current;
    const itemWidth = marqueeElement.scrollWidth / 4; // 4 sets of testimonials

    // Create marquee animation
    const setupAnimation = () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }

      animationRef.current = animate(marqueeElement, {
        duration: 40000, // 40s same as CSS
        easing: "linear",
        loop: true,
        translateX: ["0px", `-${itemWidth}px`],
      });

      // Pause animation if already hovered
      if (isHoveredRef.current) {
        animationRef.current.pause();
      }
    };

    // Initial setup
    setupAnimation();

    // Handle resize
    const handleResize = () => {
      setupAnimation();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, []);

  // Handle hover interactions
  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    if (animationRef.current) {
      animationRef.current.pause();
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    if (animationRef.current) {
      animationRef.current.play();
    }
  };

  return (
    <section
      className={cn(
        "bg-background text-foreground",
        `
          px-0 py-12
          sm:py-24
          md:py-32
          mt-16   
          sm:mt-0 
        `,
        className
      )}
    >
      <div
        className={`
          max-w-container mx-auto flex flex-col items-center gap-4 text-center
          sm:gap-16
        `}
      >
        <div
          className={`
            flex flex-col items-center gap-2 px-2
            sm:gap-8
          `}
        >
          <h2
            className={`
                 font-display text-3xl leading-tight font-bold tracking-tight
                md:text-4xl ${titleFont.className}
                `}
          >
            What Our <br className="md:hidden" />
            <br className="md:hidden" />
            Customers Say
          </h2>
          <p
            className={`
              mt-8 md:mt-4 max-w-2xl text-center text-sm md:text-base text-muted-foreground
            `}
          >
            {description}
          </p>
        </div>

        <div
          className={`
            relative flex w-full flex-col items-center justify-center
            overflow-hidden
          `}
        >
          <div
            className={`
              flex flex-row overflow-hidden p-2
              [gap:var(--gap)]
              [--gap:1rem]
            `}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className={`
                flex shrink-0 flex-row justify-around
                [gap:var(--gap)]
              `}
              ref={marqueeRef}
              style={{ translate: "none" }}
            >
              {[...Array(4)].map((_, setIndex) =>
                testimonials.map((testimonial, i) => (
                  <TestimonialCard
                    // Using UUID or other unique identifier would be better here,
                    // but for static content this is acceptable
                    key={`testimonial-${testimonial.author.name}-${setIndex}-${i}`}
                    {...testimonial}
                  />
                ))
              )}
            </div>
          </div>

          <div
            className={`
              pointer-events-none absolute inset-y-0 left-0 hidden w-1/3
              bg-gradient-to-r from-background
              sm:block
            `}
          />
          <div
            className={`
              pointer-events-none absolute inset-y-0 right-0 hidden w-1/3
              bg-gradient-to-l from-background
              sm:block
            `}
          />
        </div>
      </div>
    </section>
  );
}
