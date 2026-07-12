import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ChaosToClarity } from "@/components/landing/ChaosToClarity";
import { ProductShowcase } from "@/components/landing/ProductShowcase";
import { FeatureWalkthrough } from "@/components/landing/Features";
import { DeveloperSection } from "@/components/landing/DeveloperSection";
import { SecuritySection } from "@/components/landing/SecuritySection";
import { Personas } from "@/components/landing/Personas";
import { RoadmapSection } from "@/components/landing/RoadmapSection";
import { Pricing } from "@/components/landing/Pricing";
import { FAQSection } from "@/components/landing/FAQSection";
import { CtaBanner } from "@/components/landing/CtaBanner";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <Navbar />
      <Hero />
      <ChaosToClarity />
      <ProductShowcase />
      <FeatureWalkthrough />
      <DeveloperSection />
      <SecuritySection />
      <Personas />
      <RoadmapSection />
      <Pricing />
      <FAQSection />
      <CtaBanner />
      <Footer />
    </main>
  );
}
