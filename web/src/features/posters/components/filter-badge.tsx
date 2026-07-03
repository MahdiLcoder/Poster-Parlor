import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export const FilterBadge = ({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) => (
  <Badge
    variant="secondary"
    className="gap-1.5 pl-2.5 pr-2 py-1.5 hover:bg-secondary/80 transition-colors text-xs sm:text-sm"
  >
    {label}
    <Button
      onClick={onRemove}
      className="rounded-full hover:bg-destructive/20 p-0.5 transition-colors"
      aria-label={`Remove ${label} filter`}
    >
      <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
    </Button>
  </Badge>
);
