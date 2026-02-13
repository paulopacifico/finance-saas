import type { Metadata } from "next";

import { CTA } from "@/components/marketing/CTA";
import { Features } from "@/components/marketing/Features";
import { Hero } from "@/components/marketing/Hero";
import { Pricing } from "@/components/marketing/Pricing";
import { Testimonials } from "@/components/marketing/Testimonials";

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
