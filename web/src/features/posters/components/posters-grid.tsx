"use client";

import React from "react";
import { PosterCard } from "@/components/ui/poster-card";

interface Poster {
  _id: string;
  title: string;
  price: number;
  isAvailable: boolean;
  stock?: number;
  images?: Array<{ url: string }>;
  category?: string;
  dimensions?: string;
  tags?: string[];
}

interface PostersGridProps {
  posters: Poster[];
}

export function PostersGrid({ posters }: PostersGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 mb-8 sm:mb-12">
      {posters.map((poster) => (
        <PosterCard key={poster._id} poster={poster} />
      ))}
    </div>
  );
}
