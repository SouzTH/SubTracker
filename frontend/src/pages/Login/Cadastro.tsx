import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { registerSchema, RegisterFormValues } from '../../schemas/auth';
import { findUsersByEmail, createUser, ApiError } from '../../lib/api';

export function Register() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

    const registerMutation = useMutation({
        mutationFn: async (values: RegisterFormValues) => {
            const existing = await findUsersByEmail(values.email);
            if (existing.length > 0) {
                throw new ApiError('Este email já está cadastrado.');
            }
            return createUser(values);
        },
        onSuccess: () => {
            setTimeout(() => navigate('/'), 1200);
        },
        onError: (error) => {
            setError('root', {
                message:
                    error instanceof ApiError
                        ? error.message
                        : 'Não foi possível conectar ao servidor. Verifique se o json-server está rodando (npm run server).',
            });
        },
    });

    const onSubmit = (values: RegisterFormValues) => registerMutation.mutate(values);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <main className="w-full max-w-[380px] bg-card border border-border rounded-xl p-8">
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <h1 className="font-heading font-bold text-2xl text-center mb-6">Criar Conta</h1>

                    <div className="mb-4">
                        <div className="flex items-center gap-2 bg-background border border-border rounded-md px-4 py-3">
                            <input
                                type="text"
                                placeholder="Nome de usuário"
                                className="flex-1 bg-transparent border-none outline-none text-foreground font-body text-sm"
                                {...register('nome')}
                            />
                            <i className="bx bxs-user-detail text-muted-foreground" />
                        </div>
                        {errors.nome && <p className="text-red-500 text-xs font-body mt-1">{errors.nome.message}</p>}
                    </div>

                    <div className="mb-4">
                        <div className="flex items-center gap-2 bg-background border border-border rounded-md px-4 py-3">
                            <input
                                type="email"
                                placeholder="Email"
                                className="flex-1 bg-transparent border-none outline-none text-foreground font-body text-sm"
                                {...register('email')}
                            />
                            <i className="bx bxs-envelope text-muted-foreground" />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs font-body mt-1">{errors.email.message}</p>}
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
                    {registerMutation.isSuccess && (
                        <p className="text-primary text-[13px] font-body text-center mt-2 mb-2">
                            Conta criada! Redirecionando para o login...
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={registerMutation.isPending || registerMutation.isSuccess}
                        className="w-full mt-4 py-3 rounded-md border-none bg-primary text-primary-foreground font-heading font-bold text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {registerMutation.isPending ? 'Cadastrando...' : 'Cadastrar'}
                    </button>

                    <div className="text-center mt-6 text-sm font-body text-muted-foreground">
                        <p>
                            Já tem uma conta?{' '}
                            <a
                                href="#"
                                className="text-primary font-semibold no-underline"
                                onClick={(e) => { e.preventDefault(); navigate('/'); }}
                            >
                                Faça Login
                            </a>
                        </p>
                    </div>
                </form>
            </main>
        </div>
    );
}
