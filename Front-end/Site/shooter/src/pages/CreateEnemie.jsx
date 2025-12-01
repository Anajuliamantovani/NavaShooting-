import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateEnemie = () => {
    const navigate = useNavigate();
    
    // Estados para os dados do formulário
    const [formData, setFormData] = useState({
        name: '',
        movement: '',
        coinsDropped: '',
        wave: '',
        score: '',
        status: 'A',
        shotId: '',
        atributoId: ''
    });
    
    // Estados para preencher os Dropdowns
    const [availableShots, setAvailableShots] = useState([]);
    const [availableAttributes, setAvailableAttributes] = useState([]);

    // Estados para imagem
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);

    // Carregar Shots e Atributos ao abrir a tela
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            
            try {
                // Busca Shots
                const resShots = await axios.get('http://localhost:3000/shots/allShots', config);
                // Filtra APENAS os ativos
                const activeShots = resShots.data.shots.filter(s => s.status === 'A');
                setAvailableShots(activeShots);

                // Busca Atributos
                const resAttribs = await axios.get('http://localhost:3000/atributos/allAtributes', config);
                setAvailableAttributes(resAttribs.data.atributos);

            } catch (error) {
                console.error("Erro ao carregar listas:", error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = new FormData();
        // Adiciona campos de texto
        Object.keys(formData).forEach(key => {
            dataToSend.append(key, formData[key]);
        });
        
        // Adiciona imagem
        if (imageFile) {
            dataToSend.append('sprite', imageFile);
        }

        const token = localStorage.getItem('token');

        try {
            await axios.post('http://localhost:3000/enemies/newEnemie', dataToSend, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert('Inimigo criado com sucesso!');
            navigate('/enemies');

        } catch (error) {
            console.error("Erro ao criar inimigo:", error);
            alert('Erro ao criar inimigo. Verifique os campos.');
        }
    };

    const styles = {
        container: { maxWidth: '600px', margin: '2rem auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' },
        row: { display: 'flex', gap: '15px' },
        inputGroup: { marginBottom: '15px', flex: 1 },
        label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
        input: { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
        select: { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff' },
        button: { width: '100%', padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }
    };

    return (
        <div style={styles.container}>
            <h2>Novo Inimigo</h2>
            <form onSubmit={handleSubmit}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Nome:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} style={styles.input} required />
                </div>

                <div style={styles.row}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Wave:</label>
                        <input type="number" name="wave" value={formData.wave} onChange={handleChange} style={styles.input} required />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Pontos (Score):</label>
                        <input type="number" name="score" value={formData.score} onChange={handleChange} style={styles.input} required />
                    </div>
                </div>

                <div style={styles.row}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Movimento:</label>
                        <input type="number" name="movement" value={formData.movement} onChange={handleChange} style={styles.input} required />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Moedas Drop:</label>
                        <input type="number" name="coinsDropped" value={formData.coinsDropped} onChange={handleChange} style={styles.input} required />
                    </div>
                </div>

                {/* --- DROPDOWNS --- */}
                <div style={styles.row}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Arma (Shot):</label>
                        <select name="shotId" value={formData.shotId} onChange={handleChange} style={styles.select}>
                            <option value="">-- Selecione ou Nenhum --</option>
                            {availableShots.map(shot => (
                                <option key={shot.id} value={shot.id}>
                                    {shot.name} (Dano: {shot.damage})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Atributo:</label>
                        <select name="atributoId" value={formData.atributoId} onChange={handleChange} style={styles.select}>
                            <option value="">-- Selecione ou Nenhum --</option>
                            {availableAttributes.map(attr => (
                                <option key={attr.id} value={attr.id}>
                                    ID #{attr.id} (Vel: {attr.speed})
                                </option>
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

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Sprite (Imagem):</label>
                    <input type="file" onChange={handleFile} accept="image/*" />
                    {preview && <img src={preview} alt="Preview" style={{maxWidth: '100px', marginTop: '10px'}} />}
                </div>

                <button type="submit" style={styles.button}>Criar Inimigo</button>
            </form>
        </div>
    );
};

export default CreateEnemie;