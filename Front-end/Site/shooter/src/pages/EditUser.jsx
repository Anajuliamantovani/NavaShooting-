import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        id: '',
        nickname: '',
        email: ''
    });

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const token = localStorage.getItem('token');
            // Nota: Rota /:id/get
            const response = await axios.get(`http://localhost:3000/user/${id}/get`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const u = response.data.usuario;
            
            setFormData({
                id: u.id,
                nickname: u.nickname,
                email: u.email
            });
        } catch (error) {
            console.error("Erro ao carregar usuário", error);
            navigate('/users');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            // Rota: PUT /user/:id/update
            // O controller pede: id, email, nickname no body
            await axios.put(`http://localhost:3000/user/${id}/update`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert('Usuário atualizado com sucesso!');
            navigate('/users'); 
        } catch (error) {
            console.error("Erro ao atualizar:", error);
            alert("Erro ao atualizar (Verifique se email/nickname já existem).");
        }
    };

    const styles = {
        container: { maxWidth: '400px', margin: '2rem auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' },
        inputGroup: { marginBottom: '15px' },
        label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
        input: { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
        button: { width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }
    };

    return (
        <div style={styles.container}>
            <h2>Editar Usuário #{id}</h2>
            <form onSubmit={handleSubmit}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Nickname:</label>
                    <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} style={styles.input} required />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} style={styles.input} required />
                </div>

                <button type="submit" style={styles.button}>Salvar Alterações</button>
            </form>
        </div>
    );
};

export default EditUser;