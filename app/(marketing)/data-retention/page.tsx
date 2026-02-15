import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Retencao de Dados",
  description: "Politica de retencao de dados do Finflow.",
};

export default function DataRetentionPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-10">
      <h1 className="text-3xl font-semibold text-zinc-900">Politica de Retencao de Dados</h1>
      <p className="mt-4 text-sm text-zinc-600">Data de vigencia: 14 de fevereiro de 2026</p>

      <section className="mt-8 space-y-4 text-zinc-700">
        <p>
          Mantemos dados de contas ativas enquanto a conta estiver regular e o dado for
          necessario para a prestacao do servico.
        </p>
        <p>
          Mantemos logs de auditoria e seguranca para operacao, obrigacoes legais e resposta
          a incidentes.
        </p>
        <p>
          Em solicitacoes de exclusao verificadas, os dados pessoais sao removidos ou
          anonimizados, exceto quando houver retencao obrigatoria por lei, prevencao a fraude
          ou tratamento de disputas.
        </p>
      </section>
    </main>
  );
}
