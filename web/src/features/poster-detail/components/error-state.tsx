import { Card, CardContent } from "@/components/ui/card";

export const ErrorState = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="p-8 max-w-md">
        <CardContent className="text-center pt-6">
          <p className="text-destructive text-xl font-semibold mb-2">
            Error loading poster
          </p>
          <p className="text-muted-foreground">
            Please try again later or contact support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
