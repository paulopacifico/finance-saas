import { CTA } from "@/components/marketing/CTA";
import { Features } from "@/components/marketing/Features";
import { Hero } from "@/components/marketing/Hero";
import { Pricing } from "@/components/marketing/Pricing";
import { Testimonials } from "@/components/marketing/Testimonials";

export const revalidate = 3600;

export default function LandingPage() {
  return (
    <div className="px-4 py-12 text-zinc-900 sm:px-6 lg:px-10">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <Hero />
        <Features />
        <Pricing />
        <Testimonials />
        <CTA />
      </main>
    </div>
  );
}
