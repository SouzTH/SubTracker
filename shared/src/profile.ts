import { z } from "zod";
import type { Category } from "./constants";

// Dados pessoais + forma de pagamento (tela de Perfil).
export const personalInfoSchema = z.object({
  nome: z.string().min(2, "Informe seu nome"),
  telefone: z.string().optional(),
  paymentMethod: z.string().min(1, "Escolha uma forma de pagamento"),
});
export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;

// PATCH /auth/me: o usuário pode mandar só o que quer alterar.
export const updateProfileSchema = personalInfoSchema.partial();
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// Metas por categoria (teto mensal).
const budgetValue = z.coerce.number().min(0, "Não pode ser negativo");

// `satisfies Record<Category, ...>` faz o compilador acusar erro se uma
// categoria for adicionada em constants.ts e esquecida aqui.
const budgetShape = {
  Streaming: budgetValue,
  Trabalho: budgetValue,
  Fitness: budgetValue,
  Música: budgetValue,
  Jogos: budgetValue,
  Outros: budgetValue,
} satisfies Record<Category, typeof budgetValue>;

export const budgetsSchema = z.object(budgetShape);
export type BudgetsInput = z.infer<typeof budgetsSchema>;

// PUT /budgets: ajustar só a meta de "Streaming", por exemplo.
export const updateBudgetsSchema = budgetsSchema.partial();
export type UpdateBudgetsInput = z.infer<typeof updateBudgetsSchema>;
