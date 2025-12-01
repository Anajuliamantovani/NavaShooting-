import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditPowerUp = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        id: '', name: '', status: '', shotId: '', atributoId: '', sprite: ''
    });

    const [availableShots, setAvailableShots] = useState([]);
    const [availableAttributes, setAvailableAttributes] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const token = localStorage.getItem('token');
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        try {
            const resShots = await axios.get('http://localhost:3000/shots/allShots', config);
            setAvailableShots(resShots.data.shots.filter(s => s.status === 'A'));

            const resAttribs = await axios.get('http://localhost:3000/atributos/allAtributes', config);
            setAvailableAttributes(resAttribs.data.atributos);

            const resPowerUp = await axios.get(`http://localhost:3000/powerups/${id}/powerUp`, config);
            const pu = resPowerUp.data.powerUp;

            setFormData({
                id: pu.id,
                name: pu.name,
                status: pu.status,
                shotId: pu.shotId || '',
                atributoId: pu.atributoId || '',
                sprite: pu.sprite
            });
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            navigate('/powerups');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.put('http://localhost:3000/powerups/attPowerUp', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('PowerUp atualizado com sucesso!');
            navigate('/powerups'); 
        } catch (error) {
            console.error("Erro ao atualizar:", error);
            alert("Erro ao atualizar.");
        }
    };

    // Estilos (Reutilizados)
    const styles = {
        container: { maxWidth: '500px', margin: '2rem auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' },
        inputGroup: { marginBottom: '15px' },
        label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
        input: { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
        select: { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff' },
        button: { width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }
    };

    return (
        <div style={styles.container}>
            <h2>Editar PowerUp #{id}</h2>
            <form onSubmit={handleSubmit}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Nome:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} style={styles.input} />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Arma (Shot):</label>
                    <select name="shotId" value={formData.shotId} onChange={handleChange} style={styles.select}>
                        <option value="">-- Nenhum --</option>
                        {availableShots.map(shot => (
                            <option key={shot.id} value={shot.id}>{shot.name}</option>
                        ))}
                    </select>
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Atributo:</label>
                    <select name="atributoId" value={formData.atributoId} onChange={handleChange} style={styles.select}>
                        <option value="">-- Nenhum --</option>
                        {availableAttributes.map(attr => (
                            <option key={attr.id} value={attr.id}>ID #{attr.id}</option>
                        ))}
                    </select>
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Status:</label>
                    <select name="status" value={formData.status} onChange={handleChange} style={styles.select}>
                        <option value="A">Ativo</option>
                        <option value="D">Desativado</option>
                    </select>
                </div>
                
                {formData.sprite && <div style={{marginBottom: '10px'}}><p>Imagem atual:</p><img src={`http://localhost:3000/imagens/${formData.sprite}`} width="80" alt="Atual"/></div>}

                <button type="submit" style={styles.button}>Salvar Alterações</button>
            </form>
        </div>
    );
};

export default EditPowerUp;