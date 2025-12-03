import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nickname: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Rota de cadastro
            await axios.post('http://localhost:3000/user/register', formData);

            alert('Conta criada com sucesso! Faça login para continuar.');
            navigate('/login'); // Manda o usuário para a tela de login

        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.mensagem); // Mostra "Email já cadastrado", etc.
            } else {
                alert('Erro ao criar conta.');
            }
        }
    };

    return (
        <div className="login-full-screen">
            <div className="login-card-split">
                <div className="login-side-left">
                    <h2 className="login-title">Cadastro</h2>
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
                            <label>Nickname</label>
                            <input
                                type="text"
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleChange}
                                placeholder="Ex: CaosMaster"
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
                            Cadastrar
                        </button>
                    </form>

                    <p className="login-footer">
                        Já possui uma conta?
                        <Link to="/login" className="link-register"> Faça login</Link>
                    </p>
                </div>

                <div className="register-side-right"></div>
            </div>
        </div>
    );
};

export default Register;