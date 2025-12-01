import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateAtributo = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        speed: '',
        scale: '',
        shield: 'false' // Começa como string do select, depois convertemos
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        // Prepara o objeto (convertendo shield para booleano real)
        const payload = {
            speed: parseFloat(formData.speed),
            scale: parseFloat(formData.scale),
            shield: formData.shield === 'true'
        };

        try {
            await axios.post('http://localhost:3000/atributos/newAtribute', payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert('Atributo criado com sucesso!');
            navigate('/atributos'); 

        } catch (error) {
            console.error("Erro ao criar:", error);
            alert('Erro ao criar atributo.');
        }
    };

    const styles = {
        container: { maxWidth: '400px', margin: '2rem auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' },
        inputGroup: { marginBottom: '15px' },
        label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
        input: { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
        button: { width: '100%', padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }
    };

    return (
        <div style={styles.container}>
            <h2>Novo Atributo</h2>
            <form onSubmit={handleSubmit}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Velocidade (Speed):</label>
                    <input type="number" step="0.1" name="speed" value={formData.speed} onChange={handleChange} style={styles.input} required />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Escala (Scale):</label>
                    <input type="number" step="0.1" name="scale" value={formData.scale} onChange={handleChange} style={styles.input} required />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Possui Escudo (Shield)?</label>
                    <select name="shield" value={formData.shield} onChange={handleChange} style={styles.input}>
                        <option value="false">Não</option>
                        <option value="true">Sim</option>
                    </select>
                </div>

                <button type="submit" style={styles.button}>Salvar Atributo</button>
            </form>
        </div>
    );
};

export default CreateAtributo;