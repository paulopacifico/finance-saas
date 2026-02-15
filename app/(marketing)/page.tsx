import type { Metadata } from "next";

import { TailwindLanding } from "@/components/marketing/tailwind-landing";

export const metadata: Metadata = {
  title: "Finflow - Smart Finance Management for Modern Teams",
  description:
    "Manage your finances easily and with confidence. Real-time analytics, smart budgeting, and automated reports.",
};

export default async function LandingPage() {
  return <TailwindLanding />;
}
