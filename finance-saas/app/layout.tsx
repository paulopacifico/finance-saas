import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Finflow CAD",
  description: "Micro SaaS de finanças familiares para o mercado canadense",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
