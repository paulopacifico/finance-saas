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
    name: "Inicial",
    price: { monthly: 0, annual: 0 },
    description: "Ideal para quem esta comecando a organizar as financas",
    features: [
      "1 conexao bancaria",
      "Controle basico de transacoes",
      "Relatorios mensais",
      "Acesso mobile",
    ],
    cta: "Comecar gratis",
    popular: false,
  },
  {
    name: "Pro",
    price: { monthly: 12, annual: 120 },
    description: "Para quem precisa de analises e previsoes avancadas",
    features: [
      "Conexoes bancarias ilimitadas",
      "Orcamento assistido por IA",
      "Notificacoes em tempo real",
      "Exportacao para Excel/PDF",
      "Suporte prioritario",
      "Acompanhamento de metas",
    ],
    cta: "Iniciar teste",
    popular: true,
  },
  {
    name: "Empresarial",
    price: { monthly: 29, annual: 290 },
    description: "Para negocios com multiplas contas e operacoes",
    features: [
      "Tudo do plano Pro",
      "Acesso multiusuario (ate 5)",
      "Gestao de faturas",
      "Relatorios fiscais",
      "Gerente de conta dedicado",
      "Acesso a API",
    ],
    cta: "Falar com vendas",
    popular: false,
  },
];

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section className="bg-white py-20" id="pricing">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold">Planos simples e transparentes</h2>
          <p className="mb-8 text-xl text-gray-600">Escolha o plano ideal para o seu momento</p>

          <div className="inline-flex items-center gap-4 rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`rounded-md px-6 py-2 transition-colors ${
                !isAnnual ? "bg-white shadow" : "text-gray-600"
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`rounded-md px-6 py-2 transition-colors ${
                isAnnual ? "bg-white shadow" : "text-gray-600"
              }`}
            >
              Anual <span className="ml-1 text-sm text-green-600">(Economize 17%)</span>
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
                  Mais escolhido
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
                    {plan.price.monthly > 0 && (isAnnual ? "/ano" : "/mes")}
                  </span>
                </div>
                {isAnnual && plan.price.monthly > 0 && (
                  <p className="mt-1 text-sm text-gray-500">
                    ${(plan.price.annual / 12).toFixed(2)}/mes com cobranca anual
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
