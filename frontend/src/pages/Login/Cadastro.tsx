import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 

export function Register() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const navigate = useNavigate();

    const handleRegister = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        navigate('/'); 
    };

    return (
        <div className="auth-wrapper">
            <main className="auth-container">
                <form onSubmit={handleRegister}>
                    <h1>Criar Conta</h1>
                    
                    <div className="input-box">
                        <input 
                            type="text" 
                            placeholder="Nome de usuário" 
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required 
                        />
                        <i className='bx bxs-user-detail'></i>
                    </div>

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
                    
                    <button type="submit" className="btn-auth">Cadastrar</button>
                    
                    <div className="auth-link">
                        <p>Já tem uma conta? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Faça Login</a></p>
                    </div>
                </form>
            </main>
        </div>
    );
}