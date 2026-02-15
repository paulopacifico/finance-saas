import type { Metadata } from "next";

import { TemplateFrame } from "@/components/marketing/template-frame";

export const metadata: Metadata = {
  title: "Finflow Tailwind Template",
  description: "Tailwind template preview for Finflow landing page.",
};

export default async function TemplatePage() {
  return <TemplateFrame template="tailwind" />;
}
