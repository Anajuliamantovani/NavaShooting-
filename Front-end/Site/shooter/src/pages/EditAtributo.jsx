import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditAtributo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        id: '',
        speed: '',
        scale: '',
        shield: 'false'
    });

    useEffect(() => {
        loadAtributo();
    }, []);

    const loadAtributo = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/atributos/${id}/atribute`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = response.data.atributo;
            
            setFormData({
                id: data.id,
                speed: data.speed,
                scale: data.scale,
                shield: data.shield ? 'true' : 'false'
            });
        } catch (error) {
            console.error("Erro ao carregar", error);
            navigate('/atributos');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const payload = {
            id: formData.id,
            speed: parseFloat(formData.speed),
            scale: parseFloat(formData.scale),
            shield: formData.shield === 'true'
        };

        try {
            await axios.put('http://localhost:3000/atributos/updateAtribute', payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert('Atributo atualizado com sucesso!');
            navigate('/atributos'); 
        } catch (error) {
            console.error("Erro ao atualizar:", error);
            alert("Erro ao atualizar atributo.");
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
            <h2>Editar Atributo #{id}</h2>
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

                <button type="submit" style={styles.button}>Salvar Alterações</button>
            </form>
        </div>
    );
};

// ESSA LINHA É A MAIS IMPORTANTE PARA CORRIGIR O SEU ERRO:
export default EditAtributo;