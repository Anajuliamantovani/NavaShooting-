import React, { useState } from 'react';
import axios from 'axios'; // Importante para conectar no back
import { useNavigate, Link } from 'react-router-dom';
// O CSS (App.css) já é importado no main.jsx, então o estilo funciona automático

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
            
            const response = await axios.post('http://localhost:3000/user/login', formData);

            // Salvar Token e User
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

             alert('Login realizado com sucesso!');
            // Redirecionamento
            // DICA: Se quiser ir para o jogo, use '/home' ou '/create-nave' conforme suas rotas
            navigate('/'); 

        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.mensagem); //Mostra credenciais inválidas
            } else {
                alert('Erro ao conectar com o servidor.');
            }
        }
    };

    return (
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
                                name="email" // O 'name' é essencial para o handleChange funcionar
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
                                name="password" // O 'name' é essencial para o handleChange funcionar
                                value={formData.password} 
                                onChange={handleChange} 
                                placeholder="********"
                                required 
                            />
                        </div>

                        <button type="submit" className="btn btn-submit btn-login-neon">
                            Entrar
                        </button>
                    </form>

                    <p className="login-footer">
                        Não tem conta? 
                        {/* Usando o Link do router para não recarregar a página */}
                        <Link to="/register" className="link-register"> Cadastre-se aqui</Link>
                    </p>
                </div>

                {/* Lado Direito - Imagem */}
                <div className="login-side-right"></div>
            </div>
        </div>
    );
};

export default Login;