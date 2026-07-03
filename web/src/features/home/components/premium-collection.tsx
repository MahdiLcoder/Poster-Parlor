"use client";

import { titleFont } from "@/app/fonts";
import { PosterCard } from "@/components/ui/poster-card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  Poster,
  useGetFeaturedPostersQuery,
} from "@/store/api/inventory.api";

export function PremiumCollection() {
  const { data: featuredPostersData, isLoading } = useGetFeaturedPostersQuery(
    {}
  );

  const featuredPosters: Poster[] = featuredPostersData?.data;

  if (isLoading) {
    return (
      <section className="py-8 md:py-12">
        <div className="w-full px-6 sm:px-6 lg:px-8">
          {/* Section Header Skeleton */}
          <div className="mb-6 md:mb-10 flex flex-col items-center text-center">
            <Skeleton className="h-9 md:h-10 w-48 md:w-64 mb-3" />
            <Skeleton className="h-4 w-64 md:w-96" />
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-4 lg:gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="w-full aspect-[3/4] rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>

          {/* Button Skeleton */}
          <div className="mt-8 md:mt-10 flex justify-center">
            <Skeleton className="h-12 w-48 rounded-lg" />
          </div>
        </div>
      </section>
    );
  }

  if (!featuredPosters || featuredPosters.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-12">
      <div className="w-full px-6 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-6 md:mb-10 flex flex-col items-center text-center">
          <h2
            className={`font-display text-3xl leading-tight font-bold tracking-tight md:text-4xl ${titleFont.className}`}
          >
            Premium <br className="md:hidden" />
            <br className="md:hidden" /> Collection&apos;s
          </h2>
          <p className="mt-3 md:mt-4 max-w-2xl text-center text-sm md:text-base text-muted-foreground">
            Check out our latest and most premium posters.
          </p>
        </div>

        {/* Grid - More spacious on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-4 lg:gap-5">
          {featuredPosters.map((poster) => (
            <PosterCard key={poster._id} poster={poster} />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-8 md:mt-10 flex justify-center">
          <Link
            href="/posters"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            View All Posters
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
