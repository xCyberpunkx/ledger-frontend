import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Ledger",
  description: "Get in touch about Ledger — support, agency pricing, or a security disclosure.",
};

export default function ContactPage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-xl px-6 py-24">
        <p className="font-mono text-xs uppercase tracking-widest text-moss">Contact</p>
        <h1 className="mt-4 font-display text-3xl italic text-ink md:text-4xl">
          Talk to a person, not a ticket queue
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Questions about the product, agency pricing, or something that looks
          like a security issue — this reaches the person building Ledger, not
          a support rotation.
        </p>

        <div className="mt-10">
          <ContactForm />
        </div>
      </section>
      <Footer />
    </main>
  );
}
