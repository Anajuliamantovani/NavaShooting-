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
        <div style={styles.container}>
            <h2>Criar Nova Conta</h2>
            <form onSubmit={handleSubmit}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Nickname (Apelido):</label>
                    <input 
                        type="text" 
                        name="nickname" 
                        value={formData.nickname} 
                        onChange={handleChange} 
                        style={styles.input} 
                        required 
                    />
                </div>
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
                <button type="submit" style={styles.button}>Cadastrar</button>
            </form>
            <p style={{ marginTop: '15px' }}>
                Já tem conta? <Link to="/login">Faça login</Link>
            </p>
        </div>
    );
};

const styles = {
    container: { maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' },
    inputGroup: { marginBottom: '15px', textAlign: 'left' },
    label: { display: 'block', marginBottom: '5px' },
    input: { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
    button: { width: '100%', padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default Register;