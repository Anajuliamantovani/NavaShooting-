import React, { useState } from 'react';
import axios from 'axios'; 
import { useNavigate, Link } from 'react-router-dom';
// O estilo vem do App.css importado no main.jsx

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Conexão com o Back-end
            const response = await axios.post('http://localhost:3000/user/login', formData);

            // 1. Salvar Token e Dados do Usuário
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // 2. Feedback visual (opcional, pode remover o alert se preferir algo mais chique depois)
            // alert('Login realizado com sucesso!');

            // 3. Redirecionar para a Home (onde o menu vai aparecer magicamente)
            navigate('/'); 

        } catch (error) {
            console.error(error);
            if (error.response) {
                // Erro vindo do servidor (ex: "Senha incorreta")
                alert(error.response.data.mensagem); 
            } else {
                // Erro de conexão (ex: Servidor desligado)
                alert('Erro ao conectar com o servidor.');
            }
        }
    };

    return (
        // Esta classe 'login-full-screen' garante que a tela ocupe 100% e centralize
        <div className="login-full-screen">
            
            <div className="login-card-split">
                
                {/* Lado Esquerdo - Formulário */}
                <div className="login-side-left">
                    <h2 className="login-title">Login</h2>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>E-mail</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                placeholder="seu@email.com"
                                required 
                            />
                        </div>

                        <div className="input-group">
                            <label>Senha</label>
                            <input 
                                type="password" 
                                name="password"
                                value={formData.password} 
                                onChange={handleChange} 
                                placeholder="********"
                                required 
                            />
                        </div>

                        <button type="submit" className="btn btn-submit btn-login-neon">
                            ENTRAR
                        </button>
                    </form>

                    <p className="login-footer">
                        Não possui uma conta? 
                        <Link to="/register" className="link-register"> Cadastre-se</Link>
                    </p>
                </div>

                {/* Lado Direito - Imagem (Controlada pelo CSS .login-side-right) */}
                <div className="login-side-right"></div>
            </div>
        </div>
    );
};

export default Login;