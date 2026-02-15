import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Finflow - Controle financeiro familiar",
    template: "%s | Finflow",
  },
  description:
    "Gestao financeira familiar com acompanhamento de gastos, orcamentos e metas em CAD.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "Finflow",
    images: [
      {
        url: "/landing/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Finflow - Gestao Financeira",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Finflow - Controle financeiro familiar",
    description: "Gestao financeira com foco em clareza, seguranca e simplicidade",
    images: ["/landing/images/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
