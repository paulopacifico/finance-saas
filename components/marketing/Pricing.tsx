"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="mt-0.5 h-5 w-5 shrink-0 text-green-500"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.2 7.26a1 1 0 0 1-1.42.007L3.286 9.21a1 1 0 1 1 1.428-1.4l4.095 4.175 6.481-6.53a1 1 0 0 1 1.414-.165Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const plans = [
  {
    name: "Starter",
    price: { monthly: 0, annual: 0 },
    description: "Ideal for people starting to organize their finances",
    features: [
      "1 bank connection",
      "Basic transaction tracking",
      "Monthly reports",
      "Mobile access",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    price: { monthly: 12, annual: 120 },
    description: "For users who need advanced analytics and forecasting",
    features: [
      "Unlimited bank connections",
      "AI-assisted budgeting",
      "Real-time notifications",
      "Excel/PDF exports",
      "Priority support",
      "Goal tracking",
    ],
    cta: "Start Trial",
    popular: true,
  },
  {
    name: "Business",
    price: { monthly: 29, annual: 290 },
    description: "For businesses with multiple accounts and operations",
    features: [
      "Everything in Pro",
      "Multi-user access (up to 5)",
      "Invoice management",
      "Tax reports",
      "Dedicated account manager",
      "API access",
    ],
    cta: "Talk to Sales",
    popular: false,
  },
];

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section className="bg-white py-20" id="pricing">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold">Simple and transparent pricing</h2>
          <p className="mb-8 text-xl text-gray-600">Choose the plan that fits your stage</p>

          <div className="inline-flex items-center gap-4 rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`rounded-md px-6 py-2 transition-colors ${
                !isAnnual ? "bg-white shadow" : "text-gray-600"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`rounded-md px-6 py-2 transition-colors ${
                isAnnual ? "bg-white shadow" : "text-gray-600"
              }`}
            >
              Annual <span className="ml-1 text-sm text-green-600">(Save 17%)</span>
            </button>
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border-2 p-8 transition-all hover:shadow-2xl ${
                plan.popular ? "scale-105 border-brand-500 shadow-lg" : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-4 py-1 text-sm font-semibold text-white">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="mb-2 text-2xl font-bold">{plan.name}</h3>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold">
                    ${isAnnual ? plan.price.annual : plan.price.monthly}
                  </span>
                  <span className="text-gray-500">
                    {plan.price.monthly > 0 && (isAnnual ? "/year" : "/month")}
                  </span>
                </div>
                {isAnnual && plan.price.monthly > 0 && (
                  <p className="mt-1 text-sm text-gray-500">
                    ${(plan.price.annual / 12).toFixed(2)}/month billed annually
                  </p>
                )}
              </div>

              <Button
                asChild
                className={`mb-6 w-full ${
                  plan.popular ? "bg-brand-500 hover:bg-brand-600" : "bg-gray-900 hover:bg-gray-800"
                }`}
              >
                <Link href="/signup">{plan.cta}</Link>
              </Button>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
