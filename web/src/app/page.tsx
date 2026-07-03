import {
  PosterBannerCarousel,
  CategoryCarousel,
  PremiumCollection,
  OurServices,
  TestimonialQueue,
} from "@/features/home";
import Footer from "@/components/layout/footer/footer";

export default function Home() {
  return (
    <>
      <PosterBannerCarousel />
      <CategoryCarousel />
      <PremiumCollection />
      <TestimonialQueue />
      <OurServices />
      <Footer />
    </>
  );
}
