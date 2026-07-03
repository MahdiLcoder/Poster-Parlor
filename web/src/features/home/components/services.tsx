import { Clock, ShoppingBag, Star, Truck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { titleFont } from "@/app/fonts";

const featuresWhyChooseUs = [
  {
    title: "Free & Fast Delivery",
    description:
      "Get your posters delivered safely with premium packaging. Free shipping on all orders above ₹499.",
    icon: <Truck className="h-6 w-6 text-primary" />,
  },
  {
    title: "Secure & Easy Checkout",
    description:
      "Your payments are protected with industry-grade encryption. Fast, safe, and seamless checkout every time.",
    icon: <ShoppingBag className="h-6 w-6 text-primary" />,
  },
  {
    title: "Always Here to Help",
    description:
      "Have questions about sizes, framing, or orders? Our support team is available 24/7 to assist you.",
    icon: <Clock className="h-6 w-6 text-primary" />,
  },
  {
    title: "Premium Print Quality",
    description:
      "We use high-resolution printing and thick, durable paper so your posters look stunning for years.",
    icon: <Star className="h-6 w-6 text-primary" />,
  },
];

export function OurServices() {
  return (
    <section
      className={`
        py-8 md:py-12 mt-16
        sm:mt-0 
      `}
      id="features"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 ">
        <div className="mb-8 md:mb-10 flex flex-col items-center text-center">
          <h2
            className={`
              font-display text-3xl leading-tight font-bold tracking-tight
              md:text-4xl ${titleFont.className}
            `}
          >
            Why Choose Us
          </h2>

          <p className="mt-10 max-w-2xl text-center text-muted-foreground ">
            We offer the best shopping experience with premium features
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {featuresWhyChooseUs.map((feature) => (
            <Card
              className={`
                rounded-2xl border-none bg-background shadow transition-all
                duration-300
                hover:shadow-lg
              `}
              key={feature.title}
            >
              <CardHeader className="pb-2">
                <div
                  className={`
                    mb-3 flex h-12 w-12 items-center justify-center
                    rounded-full bg-primary/10
                  `}
                >
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
