import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import {
    forgotEmailSchema,
    ForgotEmailFormValues,
    resetPasswordSchema,
    ResetPasswordFormValues,
} from '../../schemas/auth';
import { ApiError, resetPasswordDemo } from '../../lib/api';

export function ForgotPassword() {
    const navigate = useNavigate();
    const [emailForReset, setEmailForReset] = useState<string | null>(null);

    const emailForm = useForm<ForgotEmailFormValues>({ resolver: zodResolver(forgotEmailSchema) });
    const resetForm = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema) });

    const goToPasswordStep = (values: ForgotEmailFormValues) => {
        setEmailForReset(values.email.trim().toLowerCase());
        resetForm.reset({
            novaSenha: '',
            confirmarSenha: '',
        });
        emailForm.clearErrors();
    };

    const resetPasswordMutation = useMutation({
        mutationFn: async (values: ResetPasswordFormValues) => {
            if (!emailForReset) {
                throw new ApiError('E-mail não informado.');
            }

            return resetPasswordDemo({
                email: emailForReset,
                password: values.novaSenha,
            });
        },
        onSuccess: () => {
            setTimeout(() => navigate('/'), 1600);
        },
        onError: (error) => {
            resetForm.setError('root', {
                message: error instanceof ApiError ? error.message : 'Não foi possível atualizar a senha. Tente novamente.',
            });
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <main className="w-full max-w-[380px] bg-card border border-border rounded-xl p-8">
                {!emailForReset && (
                    <form onSubmit={emailForm.handleSubmit(goToPasswordStep)} noValidate>
                        <h1 className="font-heading font-bold text-2xl text-center mb-2">Recuperar Senha</h1>
                        <p className="text-center text-[13px] text-muted-foreground font-body mb-6">
                            Informe o e-mail da sua conta para redefinir a senha no modo demonstrativo.
                        </p>

                        {emailForm.formState.errors.root && (
                            <p className="text-red-500 text-[13px] font-body text-center mb-4">
                                {emailForm.formState.errors.root.message}
                            </p>
                        )}

                        <div className="mb-2">
                            <div className="flex items-center gap-2 bg-background border border-border rounded-md px-4 py-3">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="flex-1 bg-transparent border-none outline-none text-foreground font-body text-sm"
                                    {...emailForm.register('email')}
                                />
                                <i className="bx bxs-envelope text-muted-foreground" />
                            </div>
                            {emailForm.formState.errors.email && (
                                <p className="text-red-500 text-xs font-body mt-1">
                                    {emailForm.formState.errors.email.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-4 py-3 rounded-md border-none bg-primary text-primary-foreground font-heading font-bold text-sm cursor-pointer disabled:opacity-60"
                        >
                            Continuar
                        </button>

                        <p className="text-center mt-6 text-sm font-body">
                            <a
                                href="#"
                                className="text-primary font-semibold no-underline"
                                onClick={(e) => { e.preventDefault(); navigate('/'); }}
                            >
                                Voltar ao login
                            </a>
                        </p>
                    </form>
                )}

                {emailForReset && !resetPasswordMutation.isSuccess && (
                    <form onSubmit={resetForm.handleSubmit((v) => resetPasswordMutation.mutate(v))} noValidate>
                        <h1 className="font-heading font-bold text-2xl text-center mb-2">Nova Senha</h1>
                        <p className="text-center text-[13px] text-muted-foreground font-body mb-6">
                            Defina a nova senha para <span className="font-semibold">{emailForReset}</span>.
                        </p>

                        {resetForm.formState.errors.root && (
                            <p className="text-red-500 text-[13px] font-body text-center mb-4">
                                {resetForm.formState.errors.root.message}
                            </p>
                        )}

                        <div className="mb-4">
                            <div className="flex items-center gap-2 bg-background border border-border rounded-md px-4 py-3">
                                <input
                                    type="password"
                                    placeholder="Nova senha"
                                    className="flex-1 bg-transparent border-none outline-none text-foreground font-body text-sm"
                                    {...resetForm.register('novaSenha')}
                                />
                                <i className="bx bxs-lock-alt text-muted-foreground" />
                            </div>
                            {resetForm.formState.errors.novaSenha && (
                                <p className="text-red-500 text-xs font-body mt-1">
                                    {resetForm.formState.errors.novaSenha.message}
                                </p>
                            )}
                        </div>

                        <div className="mb-2">
                            <div className="flex items-center gap-2 bg-background border border-border rounded-md px-4 py-3">
                                <input
                                    type="password"
                                    placeholder="Confirmar nova senha"
                                    className="flex-1 bg-transparent border-none outline-none text-foreground font-body text-sm"
                                    {...resetForm.register('confirmarSenha')}
                                />
                                <i className="bx bxs-lock-alt text-muted-foreground" />
                            </div>
                            {resetForm.formState.errors.confirmarSenha && (
                                <p className="text-red-500 text-xs font-body mt-1">
                                    {resetForm.formState.errors.confirmarSenha.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={resetPasswordMutation.isPending}
                            className="w-full mt-4 py-3 rounded-md border-none bg-primary text-primary-foreground font-heading font-bold text-sm cursor-pointer disabled:opacity-60"
                        >
                            {resetPasswordMutation.isPending ? 'Salvando...' : 'Redefinir senha'}
                        </button>
                    </form>
                )}

                {resetPasswordMutation.isSuccess && (
                    <div className="text-center">
                        <h1 className="font-heading font-bold text-2xl mb-2">Senha alterada!</h1>
                        <p className="text-sm text-muted-foreground font-body">Redirecionando para o login...</p>
                    </div>
                )}
            </main>
        </div>
    );
}
