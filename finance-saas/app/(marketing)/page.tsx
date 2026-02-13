import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { Features } from "@/components/marketing/Features";
import { Hero } from "@/components/marketing/Hero";

const Pricing = dynamic(
  () => import("@/components/marketing/Pricing").then((mod) => mod.Pricing),
  {
    loading: () => (
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="h-72 animate-pulse rounded-2xl bg-zinc-100" />
        </div>
      </section>
    ),
  },
);

const Testimonials = dynamic(
  () => import("@/components/marketing/Testimonials").then((mod) => mod.Testimonials),
);

const CTA = dynamic(() => import("@/components/marketing/CTA").then((mod) => mod.CTA));

export const metadata: Metadata = {
  title: "Finflow - Master Your Canadian Finances | Personal Finance SaaS",
  description:
    "Connect all your Canadian bank accounts, track spending in real-time, and achieve financial goals with AI-powered insights. Start your free trial today.",
  keywords: [
    "personal finance",
    "budgeting",
    "Canadian banking",
    "financial tracking",
    "SaaS",
  ],
  openGraph: {
    title: "Finflow - Master Your Canadian Finances",
    description: "AI-powered financial management for Canadians",
    images: ["/landing/images/og-image.png"],
  },
};

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <Pricing />
      <Testimonials />
      <CTA />
    </>
  );
}
