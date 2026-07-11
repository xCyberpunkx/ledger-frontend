import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ProductPreview } from "@/components/landing/ProductPreview";
import { Personas } from "@/components/landing/Personas";
import { Features } from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";
import { CtaBanner } from "@/components/landing/CtaBanner";
import { Footer } from "@/components/landing/Footer";

// This page itself stays a Server Component — only the pieces that need
// interactivity (Navbar, Hero's button, Pricing's buttons) declare
// "use client" internally. That's the App Router pattern: push "use
// client" as far down the tree as it'll go, don't slap it on the page.
export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <Navbar />
      <Hero />
      <ProductPreview />
      <Personas />
      <Features />
      <Pricing />
      <CtaBanner />
      <Footer />
    </main>
  );
}
