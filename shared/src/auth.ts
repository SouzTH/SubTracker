import { z } from "zod";
import { PASSWORD_MIN_LENGTH } from "./constants";

const emailField = z.string().min(1, "Informe o email").email("Email inválido");

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Informe a senha"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  nome: z.string().min(2, "Informe seu nome"),
  email: emailField,
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `A senha precisa ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres`),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotEmailSchema = z.object({
  email: emailField,
});
export type ForgotEmailInput = z.infer<typeof forgotEmailSchema>;

export const resetPasswordSchema = z
  .object({
    email: emailField,
    password: z.string().min(PASSWORD_MIN_LENGTH, `A senha precisa ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres`).optional(),
    novaSenha: z.string().min(PASSWORD_MIN_LENGTH, `A senha precisa ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres`).optional(),
  })
  .refine((data) => Boolean(data.password ?? data.novaSenha), {
    message: "Informe a nova senha",
    path: ["password"],
  })
  .transform((data) => ({
    email: data.email,
    password: data.password ?? data.novaSenha ?? "",
  }));
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
