import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de Privacidade",
  description: "Politica de privacidade do Finflow para usuarios no Canada.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-10">
      <h1 className="text-3xl font-semibold text-zinc-900">Politica de Privacidade</h1>
      <p className="mt-4 text-sm text-zinc-600">Data de vigencia: 14 de fevereiro de 2026</p>

      <section className="mt-8 space-y-4 text-zinc-700">
        <p>
          O Finflow processa dados pessoais e financeiros para oferecer consolidacao de contas,
          gestao de transacoes, insights de orcamento e suporte.
        </p>
        <p>
          Coletamos dados de perfil da conta, metadados de transacoes e logs de uso.
          Nao comercializamos dados financeiros pessoais.
        </p>
        <p>
          Usuarios podem solicitar acesso, correcao e exclusao por meio do processo de DSR.
          As solicitacoes sao registradas e tratadas conforme obrigacoes legais.
        </p>
        <p>
          Para solicitacoes de privacidade, contate:
          {" "}
          <a className="underline" href="mailto:privacy@finflow.app">
            privacy@finflow.app
          </a>
          .
        </p>
      </section>
    </main>
  );
}
