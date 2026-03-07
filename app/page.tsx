import HeroSection from "@/components/landing/HeroSection";
import FeatureCards from "@/components/landing/FeatureCards";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background text-foreground selection:bg-primary/30">
      <HeroSection />
      <FeatureCards />
      <Footer />
    </main>
  );
}
