import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Finflow - Master Your Canadian Finances",
    template: "%s | Finflow",
  },
  description:
    "AI-powered financial management for Canadians. Track spending, budgets, and achieve your financial goals.",
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "/",
    siteName: "Finflow",
    images: [
      {
        url: "/landing/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Finflow - Financial Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Finflow - Master Your Canadian Finances",
    description: "AI-powered financial management for Canadians",
    images: ["/landing/images/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
