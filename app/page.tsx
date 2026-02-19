import { CTA } from "@/components/landing/CTA";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { MicroInteractions } from "@/components/landing/MicroInteractions";
import { Navbar } from "@/components/landing/Navbar";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header>
        <Navbar />
      </header>
      <main id="main-content">
        <Hero />
        <Features />
        <Pricing />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
      <MicroInteractions />
    </>
  );
}
