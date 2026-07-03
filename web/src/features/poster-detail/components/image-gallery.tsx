import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageData } from "../types";

interface ImageGalleryProps {
  images: ImageData[];
  selectedImage: number;
  onImageSelect: (index: number) => void;
  title: string;
  isAvailable: boolean;
}

export const ImageGallery = ({
  images,
  selectedImage,
  onImageSelect,
  title,
  isAvailable,
}: ImageGalleryProps) => {
  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-2">
        <div className="relative bg-muted aspect-square">
          {images.length > 0 ? (
            <Image
              src={images[selectedImage].url}
              alt={title}
              fill
              className="object-contain p-4"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-muted-foreground">No image available</p>
            </div>
          )}
          {!isAvailable && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <Badge variant="destructive" className="text-lg px-6 py-2">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
      </Card>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((img, idx) => (
            <button
              key={img._id}
              onClick={() => onImageSelect(idx)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                selectedImage === idx
                  ? "border-primary ring-2 ring-primary ring-offset-2"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <Image
                src={img.url}
                alt={`View ${idx + 1}`}
                fill
                className="object-cover"
                sizes="150px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
