import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { PropertyList } from "@/components/PropertyList";
import { FeatureSection } from "@/components/FeatureSection";
import { TestimonialSection } from "@/components/TestimonialSection";
import { StatsSection } from "@/components/StatsSection";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <HeroSection />
      <PropertyList />
      <FeatureSection />
      <TestimonialSection />
      <StatsSection />
      <Footer />
    </main>
  );
}
