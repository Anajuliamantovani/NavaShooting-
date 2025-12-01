import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditEnemie = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        movement: '',
        coinsDropped: '',
        wave: '',
        score: '',
        status: '',
        shotId: '',
        atributoId: '',
        sprite: ''
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
            // 1. Carregar Listas para os Dropdowns
            const resShots = await axios.get('http://localhost:3000/shots/allShots', config);
            const activeShots = resShots.data.shots.filter(s => s.status === 'A');
            setAvailableShots(activeShots);

            const resAttribs = await axios.get('http://localhost:3000/atributos/allAtributes', config);
            setAvailableAttributes(resAttribs.data.atributos);

            // 2. Carregar o Inimigo Atual
            const resEnemy = await axios.get(`http://localhost:3000/enemies/${id}/enemie`, config);
            const enemy = resEnemy.data.enemy;

            setFormData({
                id: enemy.id,
                name: enemy.name,
                movement: enemy.movement,
                coinsDropped: enemy.coinsDropped,
                wave: enemy.wave,
                score: enemy.score,
                status: enemy.status,
                shotId: enemy.shotId || '', // Se for null, vira string vazia para o select
                atributoId: enemy.atributoId || '',
                sprite: enemy.sprite
            });

        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            navigate('/enemies');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            // Envia JSON (PUT) pois não estamos trocando imagem aqui
            await axios.put('http://localhost:3000/enemies/updateEnemie', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert('Inimigo atualizado com sucesso!');
            navigate('/enemies'); 
        } catch (error) {
            console.error("Erro ao atualizar:", error);
            alert("Erro ao atualizar.");
        }
    };

    const styles = {
        container: { maxWidth: '600px', margin: '2rem auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' },
        row: { display: 'flex', gap: '15px' },
        inputGroup: { marginBottom: '15px', flex: 1 },
        label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
        input: { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
        select: { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff' },
        button: { width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }
    };

    return (
        <div style={styles.container}>
            <h2>Editar Inimigo #{id}</h2>
            <form onSubmit={handleSubmit}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Nome:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} style={styles.input} required />
                </div>

                <div style={styles.row}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Wave:</label>
                        <input type="number" name="wave" value={formData.wave} onChange={handleChange} style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Pontos (Score):</label>
                        <input type="number" name="score" value={formData.score} onChange={handleChange} style={styles.input} />
                    </div>
                </div>

                <div style={styles.row}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Movimento:</label>
                        <input type="number" name="movement" value={formData.movement} onChange={handleChange} style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Moedas:</label>
                        <input type="number" name="coinsDropped" value={formData.coinsDropped} onChange={handleChange} style={styles.input} />
                    </div>
                </div>

                <div style={styles.row}>
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
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Status:</label>
                    <select name="status" value={formData.status} onChange={handleChange} style={styles.select}>
                        <option value="A">Ativo</option>
                        <option value="D">Desativado</option>
                    </select>
                </div>

                <div style={{marginBottom: '15px'}}>
                    <p style={styles.label}>Imagem Atual:</p>
                    {formData.sprite && <img src={`http://localhost:3000/imagens/${formData.sprite}`} alt="Atual" width="80" />}
                </div>

                <button type="submit" style={styles.button}>Salvar Alterações</button>
            </form>
        </div>
    );
};

export default EditEnemie;