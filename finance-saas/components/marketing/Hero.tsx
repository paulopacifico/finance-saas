import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-brand-50 to-white">
      <div className="absolute inset-0 bg-hero-pattern opacity-5" />

      <div className="container relative z-10 mx-auto grid grid-cols-1 items-center gap-12 px-4 lg:grid-cols-2">
        <div className="animate-slide-up">
          <h1 className="mb-6 text-5xl font-bold leading-tight lg:text-6xl">
            Master Your Finances with <span className="text-gradient">Finflow</span>
          </h1>

          <p className="mb-8 text-xl text-gray-600">
            Connect all your Canadian bank accounts, track spending in real-time, and achieve your
            financial goals with AI-powered insights.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-brand-500 text-white hover:bg-brand-600">
              <Link href="/signup">Start Free Trial</Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-brand-500 text-brand-500 hover:bg-brand-50"
            >
              <Link href="#features">Learn More</Link>
            </Button>
          </div>

          <div className="mt-8 flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                />
              </svg>
              <span>Bank-level encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                />
              </svg>
              <span>14-day free trial</span>
            </div>
          </div>
        </div>

        <div className="relative animate-float">
          <Image
            src="/landing/images/hero-dashboard.svg"
            alt="Finflow Dashboard Preview"
            width={600}
            height={500}
            className="rounded-lg shadow-2xl"
            priority
          />

          <div
            className="animate-slide-up absolute -left-6 -top-6 rounded-lg bg-white p-4 shadow-lg"
            style={{ animationDelay: "0.2s" }}
          >
            <p className="text-sm text-gray-500">Monthly Savings</p>
            <p className="text-2xl font-bold text-income">+$1,240</p>
          </div>

          <div
            className="animate-slide-up absolute -bottom-6 -right-6 rounded-lg bg-white p-4 shadow-lg"
            style={{ animationDelay: "0.4s" }}
          >
            <p className="text-sm text-gray-500">Accounts Connected</p>
            <p className="text-2xl font-bold text-brand-500">5</p>
          </div>
        </div>
      </div>
    </section>
  );
}
