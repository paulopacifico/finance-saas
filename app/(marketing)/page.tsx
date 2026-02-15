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
  title: "Finflow - Controle financeiro familiar em CAD",
  description:
    "Conecte contas, acompanhe gastos em tempo real e organize o planejamento financeiro da sua familia com o Finflow.",
  keywords: [
    "financas pessoais",
    "orcamento familiar",
    "controle de gastos",
    "planejamento financeiro",
    "SaaS",
  ],
  openGraph: {
    title: "Finflow - Controle financeiro familiar em CAD",
    description: "Gestao financeira com foco em clareza, seguranca e simplicidade",
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
