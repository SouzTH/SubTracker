// Converte linhas do banco (tipos gerados pelo Prisma) em objetos de domínio
// (src/repositories/types.ts). É o equivalente do "_id vira id" da aula: o
// resto da aplicação nunca vê detalhes de como o banco guarda os dados.

import { Prisma } from "@prisma/client";
import type {
  Budget as BudgetRow,
  PaymentHistoryEntry as HistoryRow,
  Subscription as SubscriptionRow,
  User as UserRow,
} from "@prisma/client";
import {
  CATEGORY_VALUES,
  DEFAULT_BUDGETS,
  type Category,
  type CategoryBudgets,
  type PaymentStatus,
  type Period,
  type SubscriptionStatus,
} from "@subtracker/shared";
import type { Subscription, User } from "../types";

// O que carregar junto com cada entidade. `satisfies` valida o formato
// contra o tipo do Prisma sem perder os valores literais, que o Prisma usa
// para tipar o resultado (ex.: que `history` veio preenchido).
// Histórico em ordem de inserção: os ids (cuid) crescem com o tempo.
export const WITH_HISTORY = {
  history: { orderBy: { id: "asc" } },
} satisfies Prisma.SubscriptionInclude;

export const WITH_BUDGETS = { budgets: true } satisfies Prisma.UserInclude;

export type SubscriptionWithHistory = SubscriptionRow & { history: HistoryRow[] };
export type UserWithBudgets = UserRow & { budgets: BudgetRow[] };

function isCategory(value: string): value is Category {
  return (CATEGORY_VALUES as readonly string[]).includes(value);
}

// Começa dos valores padrão e sobrepõe com o que o usuário personalizou:
// uma categoria nunca fica "faltando", mesmo sem nenhuma linha no banco.
export function mergeBudgets(rows: BudgetRow[]): CategoryBudgets {
  const budgets: CategoryBudgets = { ...DEFAULT_BUDGETS };
  for (const row of rows) {
    if (isCategory(row.category)) {
      budgets[row.category] = row.limitValue;
    }
  }
  return budgets;
}

export function toUser(row: UserWithBudgets): User {
  return {
    id: row.id,
    nome: row.nome,
    email: row.email,
    passwordHash: row.passwordHash,
    telefone: row.telefone ?? undefined,
    paymentMethod: row.paymentMethod ?? undefined,
    budgets: mergeBudgets(row.budgets),
  };
}

export function toSubscription(row: SubscriptionWithHistory): Subscription {
  return {
    id: row.id,
    name: row.name,
    // As colunas são String; só entram valores já validados pelo Zod na
    // borda da API, por isso o cast para o tipo literal é seguro aqui.
    category: row.category as Category,
    value: row.value,
    period: row.period as Period,
    nextCharge: row.nextCharge,
    paymentMethod: row.paymentMethod,
    status: row.status as SubscriptionStatus,
    color: row.color,
    icon: row.icon,
    history: row.history.map((entry) => ({
      date: entry.date,
      value: entry.value,
      status: entry.status as PaymentStatus,
    })),
  };
}
