"use client";

import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface PosterCardProps {
  poster: {
    _id: string;
    title: string;
    price: number;
    stock?: number;
    images?: Array<{ url: string }>;
    isAvailable: boolean;
    category?: string;
    dimensions?: string;
    tags?: string[];
  };
  className?: string;
}

export function PosterCard({ poster, className }: PosterCardProps) {
  return (
    <Link
      href={`/posters/${poster._id}`}
      className={cn("group block", className)}
    >
      <div className="relative overflow-hidden aspect-[3/4] cursor-pointer rounded-lg">
        {/* Image */}
        <div className="absolute inset-0">
          {poster.images && poster.images.length > 0 ? (
            <Image
              src={poster.images[0].url}
              alt={poster.title}
              fill
              className="object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-1 group-active:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-100 dark:bg-gray-900">
              <Package className="h-8 w-8 md:h-12 md:w-12 text-gray-400 dark:text-gray-600" />
            </div>
          )}
        </div>

        {/* Gradient Overlays - Hidden on mobile, shown on desktop hover */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Category Badge - Smaller on mobile */}
        {poster.category && (
          <Badge className="absolute left-2 top-2 md:left-3 md:top-3 text-[9px] md:text-xs backdrop-blur-md bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white border-0 shadow-lg z-10 px-1.5 py-0.5 md:px-2 md:py-1">
            {poster.category}
          </Badge>
        )}

        {/* Out of Stock Overlay */}
        {!poster.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-20">
            <Badge
              variant="destructive"
              className="text-xs md:text-sm px-3 py-1.5 md:px-6 md:py-2 shadow-lg"
            >
              Out of Stock
            </Badge>
          </div>
        )}

        {/* Content Overlay - Bottom (Desktop only) */}
        <div className="hidden md:block absolute inset-x-0 bottom-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 z-10">
          {/* Title */}
          <h3 className="text-white font-bold text-lg md:text-xl mb-2 line-clamp-2 drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            {poster.title}
          </h3>

          {/* Price and Stock */}
          <div className="flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
            <div>
              <p className="text-white text-2xl md:text-3xl font-bold drop-shadow-lg">
                ₹{poster.price}
              </p>
              {poster.stock !== undefined && poster.stock > 0 && (
                <p className="text-xs text-gray-300 mt-0.5">
                  {poster.stock} in stock
                </p>
              )}
            </div>

            {/* View Button */}
            <div className="flex items-center gap-2 text-white text-sm font-semibold">
              <span className="hidden sm:inline">View Details</span>
              <span>→</span>
            </div>
          </div>
        </div>

        {/* Corner Accent (Desktop only) */}
        <div className="hidden md:block absolute top-0 right-0 w-0 h-0 border-t-[40px] border-t-transparent border-r-[40px] border-r-white/10 dark:border-r-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Compact Info Below Image - Smaller text on mobile */}
      <div className="mt-2 md:mt-3 px-0.5 md:px-1">
        <h3 className="text-xs md:text-sm lg:text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 md:line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {poster.title}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm md:text-base lg:text-lg font-bold text-gray-900 dark:text-gray-100">
            ₹{poster.price}
          </p>
          {poster.stock !== undefined && (
            <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
              {poster.stock > 0 ? `${poster.stock} left` : "Out"}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
