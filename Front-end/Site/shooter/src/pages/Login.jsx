import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

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
            // A rota correta baseada no seu router é /user/login
            const response = await axios.post('http://localhost:3000/user/login', formData);

            // 1. Salvar o Token e os dados do usuário no navegador
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            alert('Login realizado com sucesso!');
            
            // 2. Redirecionar para a página principal ou para Criar Nave
            navigate('/'); // Mude '/' para '/create-nave' se quiser ir direto pra lá

        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.mensagem); // Mostra "Credenciais inválidas" etc.
            } else {
                alert('Erro ao conectar com o servidor.');
            }
        }
    };

    return (
        <div style={styles.container}>
            <h2>Acessar Sistema</h2>
            <form onSubmit={handleSubmit}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>E-mail:</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        style={styles.input} 
                        required 
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Senha:</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        style={styles.input} 
                        required 
                    />
                </div>
                <button type="submit" style={styles.button}>Entrar</button>
            </form>
            <p style={{ marginTop: '15px' }}>
                Não tem conta? <Link to="/register">Cadastre-se aqui</Link>
            </p>
        </div>
    );
};

const styles = {
    container: { maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' },
    inputGroup: { marginBottom: '15px', textAlign: 'left' },
    label: { display: 'block', marginBottom: '5px' },
    input: { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
    button: { width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default Login;