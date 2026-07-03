"use client";
import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { logoFont } from "@/app/fonts";
import { cn } from "@/lib/utils";

export function Logo() {
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!logoRef.current) return;

    const letters = logoRef.current.querySelectorAll(".letter");

    // Initial animation on mount
    animate(letters, {
      opacity: [0, 1],
      translateY: [20, 0],
      translateZ: 0,
      ease: "outExpo",
      duration: 1400,
      delay: stagger(50),
    });

    // Hover animation
    const handleMouseEnter = () => {
      animate(letters, {
        scale: [1, 1.15, 1],
        translateY: [0, -8, 0],
        ease: "inOutQuad",
        duration: 600,
        delay: stagger(40),
      });
    };

    const logoElement = logoRef.current;
    logoElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      logoElement.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  const text = "Poster Parlor";

  return (
    <div
      ref={logoRef}
      className={cn(
        `flex items-center gap-0.5 cursor-pointer select-none ${logoFont.className} transition-colors overflow-visible py-2`
      )}
      style={{
        fontSize: "1.5rem",
        fontWeight: "900",
        letterSpacing: "0.01em",
      }}
    >
      {text.split("").map((char, index) => (
        <span
          key={index}
          className="letter inline-block text-gray-800 dark:text-white"
          style={{
            opacity: 0,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
}
