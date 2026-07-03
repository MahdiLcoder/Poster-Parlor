"use client";

import { collectionFont, titleFont } from "@/app/fonts";
import { useGetAllFiltersQuery } from "@/store/api/inventory.api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState, useCallback, useEffect } from "react";

interface FiltersData {
  data?: {
    categories?: CategoryItem[];
  };
}

interface CategoryItem {
  category: string;
  count: number;
}

interface Category {
  name: string;
  image: string;
  productCount: number;
}

const categoryImageMap: Record<string, string> = {
  Anime:
    "https://res.cloudinary.com/buymybook/image/upload/v1766812177/Posters/Luffy_fnljbm.jpg",
  Bikes:
    "https://res.cloudinary.com/buymybook/image/upload/v1766812177/Posters/bike_dpbwhg.jpg",
  Cars: "https://res.cloudinary.com/buymybook/image/upload/v1766812177/Posters/ford_mustang_boss_1969_xxyfy4.jpg",
  spritual:
    "https://res.cloudinary.com/buymybook/image/upload/v1766812177/Posters/Lord_Shiva_Wallpaper_eojx2f.jpg",
  Marvel:
    "https://res.cloudinary.com/buymybook/image/upload/v1764569307/Posters/spiderman_s29bir.jpg",
  Sports:
    "https://res.cloudinary.com/buymybook/image/upload/v1766812177/Posters/Matchday___Gameday___Poster___Sports_graphic_design_fror4l.jpg",
};

export function CategoryCarousel() {
  const { data, isLoading } = useGetAllFiltersQuery() as {
    data?: FiltersData;
    isLoading: boolean;
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const categories: Category[] =
    data?.data?.categories?.map((item) => ({
      name: item.category.charAt(0).toUpperCase() + item.category.slice(1),
      image: categoryImageMap[item.category] || "/fallback.jpeg",
      productCount: item.count,
    })) ?? [];

  const checkScrollButtons = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft <
          container.scrollWidth - container.clientWidth - 10
      );
    }
  }, []);

  useEffect(() => {
    // Initial check after render
    const timer = setTimeout(() => {
      checkScrollButtons();
    }, 100);

    const container = scrollContainerRef.current;

    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      window.addEventListener("resize", checkScrollButtons);

      return () => {
        clearTimeout(timer);
        container.removeEventListener("scroll", checkScrollButtons);
        window.removeEventListener("resize", checkScrollButtons);
      };
    }

    return () => clearTimeout(timer);
  }, [checkScrollButtons, categories.length]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <section className="mt-6 pt-12 pb-8 md:mt-0 md:py-12">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="mb-6 md:mb-10 flex flex-col items-center text-center">
            <Skeleton className="h-10 w-48 mb-4" />
            <Skeleton className="h-4 w-64 md:w-96" />
          </div>

          {/* Mobile Skeleton */}
          <div className="md:hidden -mx-4 px-4 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2.5 pb-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton
                  key={i}
                  className="flex-shrink-0 w-[88px] h-[96px] rounded-md"
                />
              ))}
            </div>
          </div>

          {/* Desktop Skeleton */}
          <div className="hidden md:block">
            <div className="flex gap-4 md:gap-5 pb-2 overflow-x-auto scrollbar-hide">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={i}
                  className="flex-shrink-0 w-[280px] lg:w-[320px] h-[240px] lg:h-[260px] rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="mt-6 pt-12 pb-8 md:mt-0 md:py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 md:mb-10 flex flex-col items-center text-center">
          <h2
            className={`text-3xl md:text-4xl font-bold tracking-tight ${titleFont.className}`}
          >
            Collection&apos;s
          </h2>

          <p className="md:hidden text-sm text-muted-foreground mt-8">
            Discover posters that match your vibe.
          </p>

          <p className="hidden md:block mt-5 max-w-2xl text-gray-600">
            Discover posters that match your vibe.
          </p>
        </div>

        {/* Mobile Carousel - No Scroll Buttons */}
        <div className="md:hidden -mx-4 px-4 overflow-x-auto scrollbar-hide scroll-smooth">
          <div className="flex gap-2.5 pb-2">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/posters?category=${category.name.toLowerCase()}`}
                className="group relative flex-shrink-0 w-[88px] h-[96px] overflow-hidden rounded-md"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-active:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end p-2">
                  <h3 className="text-[8px] leading-tight text-white font-semibold line-clamp-2">
                    {category.name}
                  </h3>
                  <p className="text-[8px] text-gray-300 font-medium">
                    {category.productCount}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop Carousel with Scroll Buttons */}
        <div className="hidden md:block relative">
          <div
            ref={scrollContainerRef}
            className="-mx-4 px-4 overflow-x-auto scrollbar-hide scroll-smooth"
          >
            <div className="flex gap-4 md:gap-5 pb-2">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={`/posters?category=${category.name.toLowerCase()}`}
                  className="group relative flex-shrink-0 w-[280px] lg:w-[320px] h-[240px] lg:h-[260px] overflow-hidden rounded-lg cursor-pointer"
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500" />

                  <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                    <div className="transition-transform duration-500 group-hover:-translate-y-1">
                      <h3
                        className={`text-2xl md:text-3xl text-white mb-1 tracking-tight ${collectionFont.className}`}
                      >
                        {category.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <p className="text-xs md:text-sm text-gray-300 font-medium">
                          {category.productCount} products
                        </p>
                        <div className="h-px w-6 bg-gray-400 opacity-0 group-hover:opacity-100 group-hover:w-10 transition-all duration-500" />
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-xs md:text-sm font-semibold">
                          Explore →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Scroll Navigation Buttons - Desktop Only */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
