import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditShot = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        price: '',
        damage: '',
        status: 'A',
        sprite: ''
    });

    useEffect(() => {
        loadShot();
    }, []);

    const loadShot = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/shots/${id}/shot`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const shot = response.data.shot;
            
            setFormData({
                id: shot.id,
                name: shot.name,
                price: shot.price,
                damage: shot.damage,
                status: shot.status,
                sprite: shot.sprite
            });
        } catch (error) {
            console.error("Erro ao carregar shot", error);
            alert("Shot não encontrado!");
            navigate('/shots');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            // Nota: Rota attShot (atualizar shot)
            await axios.put('http://localhost:3000/shots/attShot', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert('Shot atualizado com sucesso!');
            navigate('/shots'); 
        } catch (error) {
            console.error("Erro ao atualizar:", error);
            alert("Erro ao atualizar shot.");
        }
    };

    const styles = {
        container: { maxWidth: '500px', margin: '2rem auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' },
        inputGroup: { marginBottom: '15px' },
        label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
        input: { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
        button: { width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }
    };

    return (
        <div style={styles.container}>
            <h2>Editar Shot #{id}</h2>
            <form onSubmit={handleSubmit}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Nome:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} style={styles.input} required />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Preço:</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Dano (Damage):</label>
                    <input type="number" name="damage" value={formData.damage} onChange={handleChange} style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Status:</label>
                    <select name="status" value={formData.status} onChange={handleChange} style={styles.input}>
                        <option value="A">Ativo</option>
                        <option value="D">Desativado</option>
                    </select>
                </div>
                
                <div style={{marginBottom: '20px'}}>
                    <p>Imagem atual:</p>
                    {formData.sprite && (
                        <img src={`http://localhost:3000/imagens/${formData.sprite}`} alt="Atual" width="100" />
                    )}
                </div>

                <button type="submit" style={styles.button}>Salvar Alterações</button>
            </form>
        </div>
    );
};

export default EditShot;