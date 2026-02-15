import type { Metadata } from "next";

import { TailwindLanding } from "@/components/marketing/tailwind-landing";

export const metadata: Metadata = {
  title: "Finflow Tailwind Template",
  description: "Tailwind template preview for Finflow landing page.",
};

export default async function TemplatePage() {
  return <TailwindLanding />;
}
