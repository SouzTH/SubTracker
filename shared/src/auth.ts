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
    token: z.string().min(1, "Token de recuperação inválido").max(256),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, `A senha precisa ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres`),
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
