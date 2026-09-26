import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

// NOTA IMPORTANTE: este é um fluxo SIMPLIFICADO, adequado para o protótipo local.
// Um sistema real nunca deixaria trocar a senha só por saber o email — o certo
// seria enviar um link/token de uso único por email e validar esse token antes
// de aceitar a nova senha. Como não temos um servidor de email aqui, pedimos a
// confirmação do email e deixamos definir a nova senha na hora. Bom para
// demonstrar o fluxo (UC de recuperação de senha), mas vale citar essa
// limitação no relatório/apresentação do projeto.

export function ForgotPassword() {
    const [step, setStep] = useState<'email' | 'reset' | 'done'>('email');
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState<string | null>(null);
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleBuscarEmail = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErro('');
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/users');
            if (!response.ok) throw new Error('Falha na resposta do servidor');
            const users = await response.json();
            const cleanEmail = email.trim();
            const match = users.find((u: any) => u.email === cleanEmail);

            if (match) {
                setUserId(match.id);
                setStep('reset');
            } else {
                setErro('Não encontramos nenhuma conta com este email.');
            }
        } catch (error) {
            console.error(error);
            setErro('Erro de conexão ao servidor. Verifique se o json-server está a correr.');
        } finally {
            setLoading(false);
        }
    };

    const handleRedefinir = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErro('');

        if (novaSenha.length < 4) {
            setErro('A nova senha precisa ter pelo menos 4 caracteres.');
            return;
        }
        if (novaSenha !== confirmarSenha) {
            setErro('As senhas não coincidem.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: novaSenha }),
            });
            if (!response.ok) throw new Error('Falha ao atualizar senha');

            setStep('done');
            setTimeout(() => navigate('/'), 1600);
        } catch (error) {
            console.error(error);
            setErro('Não foi possível atualizar a senha. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <main className="auth-container">
                {step === 'email' && (
                    <form onSubmit={handleBuscarEmail}>
                        <h1>Recuperar Senha</h1>
                        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--muted-foreground, #a1a1aa)', marginTop: '-20px', marginBottom: '24px' }}>
                            Informe o email da sua conta para definir uma nova senha.
                        </p>

                        {erro && <div style={{ color: '#ff4444', marginBottom: '16px', textAlign: 'center', fontSize: '14px' }}>{erro}</div>}

                        <div className="input-box">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <i className='bx bxs-envelope'></i>
                        </div>

                        <button type="submit" className="btn-auth" disabled={loading}>
                            {loading ? 'Buscando...' : 'Continuar'}
                        </button>

                        <div className="auth-link">
                            <p><a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Voltar ao login</a></p>
                        </div>
                    </form>
                )}

                {step === 'reset' && (
                    <form onSubmit={handleRedefinir}>
                        <h1>Nova Senha</h1>
                        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--muted-foreground, #a1a1aa)', marginTop: '-20px', marginBottom: '24px' }}>
                            Conta encontrada! Defina sua nova senha.
                        </p>

                        {erro && <div style={{ color: '#ff4444', marginBottom: '16px', textAlign: 'center', fontSize: '14px' }}>{erro}</div>}

                        <div className="input-box">
                            <input
                                type="password"
                                placeholder="Nova senha"
                                value={novaSenha}
                                onChange={(e) => setNovaSenha(e.target.value)}
                                required
                                minLength={4}
                            />
                            <i className='bx bxs-lock-alt'></i>
                        </div>

                        <div className="input-box">
                            <input
                                type="password"
                                placeholder="Confirmar nova senha"
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                required
                                minLength={4}
                            />
                            <i className='bx bxs-lock-alt'></i>
                        </div>

                        <button type="submit" className="btn-auth" disabled={loading}>
                            {loading ? 'Salvando...' : 'Redefinir senha'}
                        </button>
                    </form>
                )}

                {step === 'done' && (
                    <div style={{ textAlign: 'center' }}>
                        <h1>Senha alterada!</h1>
                        <p style={{ fontSize: '14px', color: 'var(--muted-foreground, #a1a1aa)' }}>
                            Redirecionando para o login...
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
