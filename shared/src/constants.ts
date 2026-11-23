// Constantes de domínio usadas pelo frontend E pelo backend.
//
// Antes elas existiam em duas cópias (frontend/src/schemas/subscription.ts
// e backend/src/constants/budgets.ts). Duas cópias sempre acabam divergindo
// — foi o que aconteceu com o tamanho mínimo da senha (4 no front, 6 no
// back). Aqui existe uma fonte única da verdade.

export const CATEGORY_VALUES = [
  "Streaming",
  "Trabalho",
  "Fitness",
  "Música",
  "Jogos",
  "Outros",
] as const;

export const PERIOD_VALUES = ["Mensal", "Trimestral", "Anual"] as const;

export const SUBSCRIPTION_STATUS_VALUES = ["Ativa", "Pausada"] as const;

export const PAYMENT_STATUS_VALUES = ["Pago", "Pendente"] as const;

export type Category = (typeof CATEGORY_VALUES)[number];
export type Period = (typeof PERIOD_VALUES)[number];
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUS_VALUES)[number];
export type PaymentStatus = (typeof PAYMENT_STATUS_VALUES)[number];

export type CategoryBudgets = Record<Category, number>;

// Metas (teto mensal) que todo usuário começa tendo, até personalizar.
export const DEFAULT_BUDGETS: CategoryBudgets = {
  Streaming: 120,
  Trabalho: 350,
  Fitness: 100,
  Música: 30,
  Jogos: 80,
  Outros: 50,
};

// Regra de senha (mesma do formulário de cadastro atual do frontend).
// Para endurecer a regra, basta mudar este número: front e back acompanham.
export const PASSWORD_MIN_LENGTH = 4;
