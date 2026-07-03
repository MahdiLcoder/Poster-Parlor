import { Badge } from "@/components/ui/badge";

interface ProductTagsProps {
  tags: string[];
}

export const ProductTags = ({ tags }: ProductTagsProps) => {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, idx) => (
        <Badge key={idx} variant="outline" className="px-3 py-1">
          {tag}
        </Badge>
      ))}
    </div>
  );
};
