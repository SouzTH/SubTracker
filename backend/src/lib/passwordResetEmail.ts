import nodemailer, { type Transporter } from "nodemailer";
import { env } from "./env";
import { AppError } from "../utils/AppError";

let transporter: Transporter | undefined;

export function getPasswordResetTransport(): Transporter {
  if (!env.smtpHost || !env.passwordResetEmailFrom) {
    throw new AppError("O serviço de recuperação de senha não está configurado.", 503);
  }
  if (Boolean(env.smtpUser) !== Boolean(env.smtpPassword)) {
    throw new AppError("A configuração SMTP está incompleta.", 503);
  }

  transporter ??= nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 30_000,
    ...(env.smtpUser && env.smtpPassword
      ? { auth: { user: env.smtpUser, pass: env.smtpPassword } }
      : {}),
  });
  return transporter;
}

export async function sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
  const mailer = getPasswordResetTransport();
  const from = env.passwordResetEmailFrom;
  if (!from) {
    throw new AppError("O serviço de recuperação de senha não está configurado.", 503);
  }
  await mailer.sendMail({
    from,
    to: email,
    subject: "Redefinição de senha do SubTracker",
    text: [
      "Recebemos uma solicitação para redefinir a senha da sua conta SubTracker.",
      `Use este link em até 20 minutos: ${resetUrl}`,
      "Se você não solicitou a redefinição, ignore esta mensagem.",
    ].join("\n\n"),
    html: `<p>Recebemos uma solicitação para redefinir a senha da sua conta SubTracker.</p><p><a href="${resetUrl}">Redefinir senha</a></p><p>O link expira em 20 minutos. Se você não solicitou a redefinição, ignore esta mensagem.</p>`,
  });
}
