import { TestimonialsSection } from "@/components/primitives/testimonial";

const testimonials = [
  {
    author: {
      avatar:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face",
      handle: "@ananyaaa",
      name: "Ananya Sharma",
    },
    text: "Absolutely loved the quality! Ordered 3 anime posters and the print was so crisp. They completely changed the vibe of my room. Delivery was quick too!",
  },
  {
    author: {
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      handle: "@rahulvibes",
      name: "Rahul Verma",
    },
    text: "Didn't expect the posters to look this premium. The colors are vibrant and the paper quality is solid. My friends keep asking where I got them!",
  },
  {
    author: {
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      handle: "@devwithchai",
      name: "Dev Patel",
    },
    text: "Ordered a Ronaldo and a minimal quote poster. Both arrived perfectly packed. For the price, it's honestly the best poster store I've tried.",
  },
  {
    author: {
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
      handle: "@meghart",
      name: "Megha Iyer",
    },
    text: "Loved how easy it was to pick posters based on theme. Customer support helped me choose the right size for my wall. Super helpful team!",
  },
  {
    author: {
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      handle: "@arjunreviews",
      name: "Arjun Singh",
    },
    text: "My order arrived two days earlier than expected. The packaging was safe and the print quality exceeded my expectations. Already planning my next purchase 👀",
  },
  {
    author: {
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      handle: "@saanviwrites",
      name: "Saanvi Gupta",
    },
    text: "Finally a store where posters actually look like the photos shown! Super clean website, easy checkout, and the quality is top-notch. 10/10 would recommend.",
  },
];

export function TestimonialQueue() {
  return (
    <TestimonialsSection
      className="py-0"
      description="Don't just take our word for it - hear from our satisfied customers"
      testimonials={testimonials}
    />
  );
}
