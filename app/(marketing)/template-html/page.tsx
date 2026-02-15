import type { Metadata } from "next";

import { TemplateFrame } from "@/components/marketing/template-frame";

export const metadata: Metadata = {
  title: "Finflow HTML Template",
  description: "HTML/CSS template preview for Finflow landing page.",
};

export default async function TemplateHtmlPage() {
  return <TemplateFrame template="html" />;
}
