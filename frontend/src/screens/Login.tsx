import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import "../style/Login.css";

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        
        if (email === 'admin@teste.com' && password === '1234') {
            navigate('/painel'); 
        } else {
            alert('Email ou senha incorretos! Para testar use: admin@teste.com / 1234');
        }
    };

    return (
        <div className="auth-wrapper">
            <main className="auth-container">
                <form onSubmit={handleLogin}>
                    <h1>Login SubTracker</h1>
                    
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