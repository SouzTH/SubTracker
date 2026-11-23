import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import {
    forgotEmailSchema,
    ForgotEmailFormValues,
    resetPasswordSchema,
    ResetPasswordFormValues,
} from '../../schemas/auth';
import { ApiError, completePasswordReset, requestPasswordReset } from '../../lib/api';

export function ForgotPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') ?? '';
    const emailForm = useForm<ForgotEmailFormValues>({ resolver: zodResolver(forgotEmailSchema) });
    const resetForm = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema) });

    const requestMutation = useMutation({
        mutationFn: requestPasswordReset,
        onError: (error) => {
            emailForm.setError('root', {
                message: error instanceof ApiError
                    ? error.message
                    : 'Não foi possível solicitar a recuperação. Tente novamente.',
            });
        },
    });

    const resetMutation = useMutation({
        mutationFn: (values: ResetPasswordFormValues) => {
            if (!token) {
                throw new ApiError('O link de redefinição é inválido ou expirou.');
            }
            return completePasswordReset({ token, password: values.novaSenha });
        },
        onError: (error) => {
            resetForm.setError('root', {
                message: error instanceof ApiError
                    ? error.message
                    : 'Não foi possível redefinir a senha. Tente novamente.',
            });
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <main className="w-full max-w-[380px] bg-card border border-border rounded-xl p-8">
                {!token && !requestMutation.isSuccess && (
                    <form
                        onSubmit={emailForm.handleSubmit((values) => requestMutation.mutate(values))}
                        noValidate
                    >
                        <h1 className="font-heading font-bold text-2xl text-center mb-2">Recuperar Senha</h1>
                        <p className="text-center text-[13px] text-muted-foreground font-body mb-6">
                            Informe o e-mail cadastrado. Se houver uma conta com esse endereço, enviaremos um link para redefinir a senha.
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
                                    autoComplete="email"
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
                            disabled={requestMutation.isPending}
                            className="w-full mt-4 py-3 rounded-md border-none bg-primary text-primary-foreground font-heading font-bold text-sm cursor-pointer disabled:opacity-60"
                        >
                            {requestMutation.isPending ? 'Enviando...' : 'Enviar link de recuperação'}
                        </button>
                    </form>
                )}

                {!token && requestMutation.isSuccess && (
                    <div className="text-center">
                        <h1 className="font-heading font-bold text-2xl mb-2">Confira seu e-mail</h1>
                        <p className="text-sm text-muted-foreground font-body">
                            Se houver uma conta com esse endereço, enviaremos um link válido por 20 minutos.
                            Confira também a pasta de spam.
                        </p>
                    </div>
                )}

                {token && !resetMutation.isSuccess && (
                    <form onSubmit={resetForm.handleSubmit((values) => resetMutation.mutate(values))} noValidate>
                        <h1 className="font-heading font-bold text-2xl text-center mb-2">Nova Senha</h1>
                        <p className="text-center text-[13px] text-muted-foreground font-body mb-6">
                            Escolha uma nova senha para sua conta.
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
                                    autoComplete="new-password"
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
                                    autoComplete="new-password"
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
                            disabled={resetMutation.isPending}
                            className="w-full mt-4 py-3 rounded-md border-none bg-primary text-primary-foreground font-heading font-bold text-sm cursor-pointer disabled:opacity-60"
                        >
                            {resetMutation.isPending ? 'Salvando...' : 'Redefinir senha'}
                        </button>
                    </form>
                )}

                {token && resetMutation.isSuccess && (
                    <div className="text-center">
                        <h1 className="font-heading font-bold text-2xl mb-2">Senha alterada!</h1>
                        <p className="text-sm text-muted-foreground font-body">
                            Faça login com sua nova senha.
                        </p>
                    </div>
                )}

                <p className="text-center mt-6 text-sm font-body">
                    <button
                        type="button"
                        className="text-primary font-semibold bg-transparent border-none cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        Voltar ao login
                    </button>
                </p>
            </main>
        </div>
    );
}
