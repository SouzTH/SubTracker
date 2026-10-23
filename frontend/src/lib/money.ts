import type { Subscription } from "../App";

// Antes esta função existia copiada em 4 arquivos (Dashboard, Report,
// SubscriptionDetails, ImportStatement). Centralizada aqui.
export function fmt(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/**
 * Converte o valor de uma assinatura para o equivalente mensal, dividindo
 * periodicidades Anual (/12) e Trimestral (/3). Usado para que o total do
 * Dashboard, as barras de meta por categoria e os totais do Relatório sempre
 * representem "quanto isso pesa por mês", independente da periodicidade de
 * cobrança de cada assinatura.
 */
export function toMonthlyValue(sub: Pick<Subscription, "value" | "period">): number {
  if (sub.period === "Anual") return sub.value / 12;
  if (sub.period === "Trimestral") return sub.value / 3;
  return sub.value;
}
