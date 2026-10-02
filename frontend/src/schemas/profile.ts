import { z } from "zod";

export const personalInfoSchema = z.object({
  nome: z.string().min(2, "Informe seu nome"),
  telefone: z.string().optional(),
  paymentMethod: z.string().min(1, "Escolha uma forma de pagamento"),
});
export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

export const budgetsSchema = z.object({
  Streaming: z.coerce.number().min(0, "Não pode ser negativo"),
  Trabalho: z.coerce.number().min(0, "Não pode ser negativo"),
  Fitness: z.coerce.number().min(0, "Não pode ser negativo"),
  Música: z.coerce.number().min(0, "Não pode ser negativo"),
  Jogos: z.coerce.number().min(0, "Não pode ser negativo"),
  Outros: z.coerce.number().min(0, "Não pode ser negativo"),
});
export type BudgetsFormValues = z.infer<typeof budgetsSchema>;
