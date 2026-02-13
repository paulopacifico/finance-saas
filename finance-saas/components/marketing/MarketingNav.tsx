"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";

export function MarketingNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-gradient text-2xl font-bold">Finflow</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/#features" className="text-gray-600 hover:text-gray-900">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button className="bg-brand-500 hover:bg-brand-600" asChild>
              <Link href="/signup">Start Free Trial</Link>
            </Button>
          </div>

          <button className="md:hidden" onClick={() => setIsOpen((open) => !open)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isOpen && (
          <div className="border-t py-4 md:hidden">
            <div className="flex flex-col gap-4">
              <Link href="/#features" className="text-gray-600">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-600">
                Pricing
              </Link>
              <Link href="/about" className="text-gray-600">
                About
              </Link>
              <hr />
              <Link href="/login" className="text-gray-600">
                Login
              </Link>
              <Button className="bg-brand-500 hover:bg-brand-600" asChild>
                <Link href="/signup">Start Free Trial</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
