import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateShot = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        damage: '', // Diferente da Nave, aqui é damage
        status: 'A'
    });
    
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);

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
        dataToSend.append('price', formData.price);
        dataToSend.append('damage', formData.damage);
        dataToSend.append('status', formData.status);
        
        if (imageFile) {
            dataToSend.append('sprite', imageFile);
        }

        const token = localStorage.getItem('token');

        try {
            await axios.post('http://localhost:3000/shots/newShot', dataToSend, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert('Shot criado com sucesso!');
            navigate('/shots'); // Volta para a lista de shots

        } catch (error) {
            console.error("Erro ao criar shot:", error);
            alert('Erro ao criar shot.');
        }
    };

    const styles = {
        container: { maxWidth: '500px', margin: '2rem auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' },
        inputGroup: { marginBottom: '15px' },
        label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
        input: { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
        button: { width: '100%', padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }
    };

    return (
        <div style={styles.container}>
            <h2>Novo Shot (Tiro)</h2>
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
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Sprite (Imagem):</label>
                    <input type="file" onChange={handleFile} accept="image/*" />
                    {preview && <img src={preview} alt="Preview" style={{maxWidth: '100px', marginTop: '10px'}} />}
                </div>

                <button type="submit" style={styles.button}>Registrar Shot</button>
            </form>
        </div>
    );
};

export default CreateShot;