import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 

export function Register() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [erro, setErro] = useState('');
    
    const navigate = useNavigate();

    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        setErro('');

        try {
            const checkResponse = await fetch(`http://localhost:3000/users?email=${email}`);
            const existingUsers = await checkResponse.json();

            if (existingUsers.length > 0) {
                setErro('Este email já se encontra registado.');
                return;
            }

            const response = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, password })
            });

            if (response.ok) {
                alert('Conta criada com sucesso! Por favor, faça login.');
                navigate('/'); 
            }
        } catch (error) {
            setErro('Erro ao comunicar com o servidor.');
        }
    };

    return (
        <div className="auth-wrapper">
            <main className="auth-container">
                <form onSubmit={handleRegister}>
                    <h1>Criar Conta</h1>
                    
                    {erro && <div style={{ color: '#ff4444', marginBottom: '16px', textAlign: 'center', fontSize: '14px' }}>{erro}</div>}

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