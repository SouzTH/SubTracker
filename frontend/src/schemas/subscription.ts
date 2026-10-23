import { z } from "zod";

export const CATEGORY_VALUES = ["Streaming", "Trabalho", "Fitness", "Música", "Jogos", "Outros"] as const;
export const PERIOD_VALUES = ["Mensal", "Trimestral", "Anual"] as const;

export const subscriptionSchema = z.object({
  category: z.enum(CATEGORY_VALUES),
  value: z.coerce.number().positive("O valor deve ser maior que zero"),
  period: z.enum(PERIOD_VALUES),
  nextCharge: z.string().min(1, "Informe a data da próxima cobrança"),
  paymentMethod: z.string().min(1, "Escolha a forma de pagamento"),
});
export type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;
