import { Truck, Shield, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Truck className="w-8 h-8 mx-auto mb-2 text-primary" />,
    title: "Free Shipping",
    description: "On orders over ₹250",
  },
  {
    icon: <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />,
    title: "Secure Payment",
    description: "100% protected",
  },
  {
    icon: <RefreshCw className="w-8 h-8 mx-auto mb-2 text-primary" />,
    title: "Easy Returns",
    description: "3-day guarantee",
  },
];

export const ProductFeatures = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              {feature.icon}
              <p className="text-sm font-medium text-foreground">
                {feature.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
