import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePowerUp = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: '',
        status: 'A',
        shotId: '',
        atributoId: ''
    });
    
    const [availableShots, setAvailableShots] = useState([]);
    const [availableAttributes, setAvailableAttributes] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            try {
                const resShots = await axios.get('http://localhost:3000/shots/allShots', config);
                setAvailableShots(resShots.data.shots.filter(s => s.status === 'A'));

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
        dataToSend.append('name', formData.name);
        dataToSend.append('status', formData.status);
        dataToSend.append('shotId', formData.shotId);
        dataToSend.append('atributoId', formData.atributoId);
        
        if (imageFile) {
            dataToSend.append('sprite', imageFile);
        }

        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:3000/powerups/newPowerUp', dataToSend, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('PowerUp criado com sucesso!');
            navigate('/powerups');
        } catch (error) {
            console.error("Erro ao criar:", error);
            alert('Erro ao criar PowerUp.');
        }
    };

    // Estilos simples
    const styles = {
        container: { maxWidth: '500px', margin: '2rem auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' },
        inputGroup: { marginBottom: '15px' },
        label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
        input: { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
        select: { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff' },
        button: { width: '100%', padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }
    };

    return (
        <div style={styles.container}>
            <h2>Novo PowerUp</h2>
            <form onSubmit={handleSubmit}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Nome:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} style={styles.input} />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Concede Arma (Shot):</label>
                    <select name="shotId" value={formData.shotId} onChange={handleChange} style={styles.select}>
                        <option value="">-- Nenhum --</option>
                        {availableShots.map(shot => (
                            <option key={shot.id} value={shot.id}>{shot.name}</option>
                        ))}
                    </select>
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Concede Atributo:</label>
                    <select name="atributoId" value={formData.atributoId} onChange={handleChange} style={styles.select}>
                        <option value="">-- Nenhum --</option>
                        {availableAttributes.map(attr => (
                            <option key={attr.id} value={attr.id}>ID #{attr.id} (Vel: {attr.speed})</option>
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

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Imagem:</label>
                    <input type="file" onChange={handleFile} accept="image/*" />
                    {preview && <img src={preview} alt="Preview" style={{maxWidth: '100px', marginTop: '10px'}} />}
                </div>

                <button type="submit" style={styles.button}>Criar PowerUp</button>
            </form>
        </div>
    );
};

export default CreatePowerUp;