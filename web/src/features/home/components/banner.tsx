"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";

const mockPosters = [
  "https://res.cloudinary.com/buymybook/image/upload/v1765544043/Posters/3_jyuuzt.jpg",
  "https://res.cloudinary.com/buymybook/image/upload/v1765544043/Posters/7_euutca.jpg",
  "https://res.cloudinary.com/buymybook/image/upload/v1765544045/Posters/5_j2jq0u.jpg",
  "https://res.cloudinary.com/buymybook/image/upload/v1765544043/Posters/4_q6gea9.jpg",
  "https://res.cloudinary.com/buymybook/image/upload/v1765544043/Posters/1_k2fyns.jpg",
  "https://res.cloudinary.com/buymybook/image/upload/v1765544043/Posters/6_u5wert.jpg",
  "https://res.cloudinary.com/buymybook/image/upload/v1765544043/Posters/2_uxjgb9.jpg",
];

export function PosterBannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const timer = setInterval(() => {
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % mockPosters.length);
      }, 800);
    }, 4500);

    return () => clearInterval(timer);
  }, [hydrated]);

  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    setTimeout(() => setCurrentIndex(index), 800);
  };

  if (!hydrated) {
    return <div className="relative w-full h-[70vh] bg-black dark:bg-white" />;
  }

  return (
    <div className="relative w-full h-[70vh] md:h-[70vh] sm:h-[60vh] xs:h-[55vh] bg-black dark:bg-white overflow-hidden">
      {mockPosters.map((poster, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-[1500ms] ease-in-out ${
            index === currentIndex
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          }`}
        >
          <Image
            src={poster}
            alt={`Poster ${index + 1}`}
            fill
            priority={index === 0}
            className="
              w-full h-full 
              object-cover     /* MOBILE - fills screen */
              md:object-contain /* DESKTOP - preserve poster ratio */
            "
          />

          {/* Dark gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60"></div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5">
        {mockPosters.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`group relative transition-all duration-500 ${
              index === currentIndex ? "w-10" : "w-2.5"
            }`}
          >
            <div
              className={`h-1 rounded-full transition-all duration-500 ${
                index === currentIndex
                  ? "bg-white shadow-lg shadow-white/50"
                  : "bg-white/30 group-hover:bg-white/50"
              }`}
            />
          </button>
        ))}
      </div>

      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/40 to-transparent"></div>
    </div>
  );
}
