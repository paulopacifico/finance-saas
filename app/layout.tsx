import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";

import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Finflow - Smart Finance Management for Modern Teams",
    template: "%s | Finflow",
  },
  description:
    "Manage your finances easily and with confidence. Real-time analytics, smart budgeting, and automated reports.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Finflow",
    title: "Finflow - Smart Finance Management for Modern Teams",
    description:
      "Manage your finances easily and with confidence. Real-time analytics, smart budgeting, and automated reports.",
    images: [
      {
        url: "/landing/images/hero-dashboard.webp",
        width: 1200,
        height: 630,
        alt: "Finflow dashboard preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Finflow - Smart Finance Management for Modern Teams",
    description:
      "Manage your finances easily and with confidence. Real-time analytics, smart budgeting, and automated reports.",
    images: ["/landing/images/hero-dashboard.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
