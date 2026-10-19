import { z } from "zod";
import {
  CATEGORY_VALUES,
  PAYMENT_STATUS_VALUES,
  PERIOD_VALUES,
  SUBSCRIPTION_STATUS_VALUES,
} from "./constants";

// Os campos que o USUÁRIO preenche no formulário de assinatura. É o mesmo
// schema que o frontend já usa hoje com react-hook-form.
// `z.coerce.number()` converte o texto de um <input> (ex.: "39.9") em número
// e também aceita um número que já venha pronto no JSON da API. Vírgula
// decimal ("39,90") NÃO é convertida: o formulário precisa entregar ponto.
export const subscriptionSchema = z.object({
  category: z.enum(CATEGORY_VALUES),
  value: z.coerce.number().positive("O valor deve ser maior que zero"),
  period: z.enum(PERIOD_VALUES),
  nextCharge: z.string().min(1, "Informe a data da próxima cobrança"),
  paymentMethod: z.string().min(1, "Escolha a forma de pagamento"),
});
export type SubscriptionFormInput = z.infer<typeof subscriptionSchema>;

export const paymentHistoryEntrySchema = z.object({
  date: z.string().min(1, "Informe a data do pagamento"),
  value: z.coerce.number().min(0, "O valor não pode ser negativo"),
  status: z.enum(PAYMENT_STATUS_VALUES),
});

// O corpo completo de POST /subscriptions: os campos do formulário MAIS os
// que o app define sozinho (nome vindo do catálogo, cor, ícone, histórico).
// `.extend` reaproveita o schema do formulário em vez de reescrevê-lo —
// regra de validação muda em um lugar só.
export const createSubscriptionSchema = subscriptionSchema.extend({
  name: z.string().trim().min(1, "Informe o nome da assinatura"),
  status: z.enum(SUBSCRIPTION_STATUS_VALUES).default("Ativa"),
  color: z.string().min(1).default("#6366f1"),
  icon: z.string().min(1).default("📦"),
  history: z.array(paymentHistoryEntrySchema).default([]),
});
export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;

// PATCH: qualquer subconjunto dos campos, cada um ainda validado.
export const updateSubscriptionSchema = createSubscriptionSchema.partial();
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;
