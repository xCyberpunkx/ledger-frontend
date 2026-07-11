import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ChaosToClarity } from "@/components/landing/ChaosToClarity";
import { Personas } from "@/components/landing/Personas";
import { Pricing } from "@/components/landing/Pricing";
import { CtaBanner } from "@/components/landing/CtaBanner";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <Navbar />
      <Hero />
      <ChaosToClarity />
      <Personas />
      <Pricing />
      <CtaBanner />
      <Footer />
    </main>
  );
}
