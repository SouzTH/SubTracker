import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Informe o email").email("Email inválido"),
  password: z.string().min(1, "Informe a senha"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  nome: z.string().min(2, "Informe seu nome"),
  email: z.string().min(1, "Informe o email").email("Email inválido"),
  password: z.string().min(4, "A senha precisa ter pelo menos 4 caracteres"),
});
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotEmailSchema = z.object({
  email: z.string().min(1, "Informe o email").email("Email inválido"),
});
export type ForgotEmailFormValues = z.infer<typeof forgotEmailSchema>;

export const resetPasswordSchema = z
  .object({
    novaSenha: z.string().min(4, "A senha precisa ter pelo menos 4 caracteres"),
    confirmarSenha: z.string().min(4, "A senha precisa ter pelo menos 4 caracteres"),
  })
  .refine((data) => data.novaSenha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
