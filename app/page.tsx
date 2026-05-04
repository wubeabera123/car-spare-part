import { Hero } from "@/components/home/hero";
import { Categories } from "@/components/home/categories";
import { FeaturedProducts } from "@/components/home/featured-products";
import { PopularBrands } from "@/components/home/popular-brands";
import { FeaturedDeals } from "@/components/home/featured-deals";
import { Testimonials } from "@/components/home/testimonials";
import { Newsletter } from "@/components/home/newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <FeaturedDeals />
      <PopularBrands />
      <Testimonials />
      <Newsletter />
    </>
  );
}
