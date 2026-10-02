import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { loginSchema, LoginFormValues } from '../../schemas/auth';
import { findUsersByEmail, ApiError } from '../../lib/api';

export function Login() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

    const loginMutation = useMutation({
        mutationFn: async ({ email, password }: LoginFormValues) => {
            // Busca por email e confere a senha no cliente, para não depender
            // da comparação de tipos que o json-server faz na query string.
            const users = await findUsersByEmail(email);
            const match = users.find((u) => u.email === email && u.password === password);
            if (!match) throw new ApiError('Email ou senha incorretos.');
            return match;
        },
        onSuccess: (match) => {
            // Não guarda a senha no localStorage — só o que a interface precisa.
            const { password: _senha, ...safeUser } = match;
            localStorage.setItem('subtracker_user', JSON.stringify(safeUser));
            navigate('/painel');
        },
        onError: (error) => {
            if (error instanceof ApiError && error.message === 'Email ou senha incorretos.') {
                setError('root', { message: error.message });
            } else {
                setError('root', {
                    message: 'Não foi possível conectar ao servidor. Verifique se o json-server está rodando (npm run server).',
                });
            }
        },
    });

    const onSubmit = (values: LoginFormValues) => loginMutation.mutate(values);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <main className="w-full max-w-[380px] bg-card border border-border rounded-xl p-8">
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <h1 className="font-heading font-bold text-2xl text-center mb-6">Login SubTracker</h1>

                    <div className="mb-4">
                        <div className="flex items-center gap-2 bg-background border border-border rounded-md px-4 py-3">
                            <input
                                type="email"
                                placeholder="Email"
                                className="flex-1 bg-transparent border-none outline-none text-foreground font-body text-sm"
                                {...register('email')}
                            />
                            <i className="bx bxs-user text-muted-foreground" />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-xs font-body mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="mb-2">
                        <div className="flex items-center gap-2 bg-background border border-border rounded-md px-4 py-3">
                            <input
                                type="password"
                                placeholder="Senha"
                                className="flex-1 bg-transparent border-none outline-none text-foreground font-body text-sm"
                                {...register('password')}
                            />
                            <i className="bx bxs-lock-alt text-muted-foreground" />
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs font-body mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {errors.root && (
                        <p className="text-red-500 text-[13px] font-body text-center mt-2 mb-2">{errors.root.message}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full mt-4 py-3 rounded-md border-none bg-primary text-primary-foreground font-heading font-bold text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
                    </button>

                    <div className="text-center mt-6 text-sm font-body text-muted-foreground">
                        <p>
                            Não tem uma conta?{' '}
                            <a
                                href="#"
                                className="text-primary font-semibold no-underline"
                                onClick={(e) => { e.preventDefault(); navigate('/cadastro'); }}
                            >
                                Cadastre-se
                            </a>
                        </p>
                        <p className="mt-2.5">
                            <a
                                href="#"
                                className="text-primary font-semibold no-underline"
                                onClick={(e) => { e.preventDefault(); navigate('/esqueci-senha'); }}
                            >
                                Esqueceu a senha?
                            </a>
                        </p>
                    </div>
                </form>
            </main>
        </div>
    );
}
