import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        setErro('');
        
        try {
            // Busca TODOS os utilizadores em vez de tentar filtrar no URL
            const response = await fetch('http://localhost:3000/users');
            
            if (!response.ok) {
                throw new Error('Falha na resposta do servidor');
            }

            const users = await response.json();

            // Valida as credenciais com JavaScript puro (ignora bugs do json-server)
            const cleanEmail = email.trim();
            const userMatch = users.find((u: any) => u.email === cleanEmail && u.password === password);

            if (userMatch) {
                localStorage.setItem('subtracker_user', JSON.stringify(userMatch));
                navigate('/painel'); 
            } else {
                setErro('Email ou palavra-passe incorretos!');
            }
        } catch (error) {
            console.error(error);
            setErro('Erro de conexão ao servidor. Verifique se o json-server está a correr.');
        }
    };
    
    return (
        <div className="auth-wrapper">
            <main className="auth-container">
                <form onSubmit={handleLogin}>
                    <h1>Login SubTracker</h1>
                    
                    {erro && <div style={{ color: '#ff4444', marginBottom: '16px', textAlign: 'center', fontSize: '14px' }}>{erro}</div>}

                    <div className="input-box">
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                        <i className='bx bxs-user'></i>
                    </div>
                    
                    <div className="input-box">
                        <input 
                            type="password" 
                            placeholder="Senha" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                        <i className='bx bxs-lock-alt'></i>
                    </div>
                    
                    <button type="submit" className="btn-auth">Entrar</button>
                    
                    <div className="auth-link">
                        <p>Não tem uma conta? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/cadastro'); }}>Cadastre-se</a></p>
                    </div>
                </form>
            </main>
        </div>
    );
}