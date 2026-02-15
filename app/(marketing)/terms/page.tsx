import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos de uso do Finflow.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-10">
      <h1 className="text-3xl font-semibold text-zinc-900">Termos de Uso</h1>
      <p className="mt-4 text-sm text-zinc-600">Data de vigencia: 14 de fevereiro de 2026</p>

      <section className="mt-8 space-y-4 text-zinc-700">
        <p>
          Ao usar o Finflow, voce concorda com estes termos. Voce e responsavel pelas
          credenciais da sua conta e por toda atividade realizada nela.
        </p>
        <p>
          O Finflow oferece ferramentas financeiras para informacao e planejamento e nao
          fornece consultoria juridica, tributaria ou de investimentos.
        </p>
        <p>
          Podemos suspender contas em casos de abuso, fraude ou conduta que viole a lei,
          obrigacoes contratuais ou controles de seguranca da plataforma.
        </p>
      </section>
    </main>
  );
}
