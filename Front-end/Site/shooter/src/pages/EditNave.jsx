import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditNave = () => {
    const { id } = useParams(); // Pega o ID da URL
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        price: '',
        masLife: '',
        status: 'A',
        sprite: '' // Nome do arquivo atual
    });

    useEffect(() => {
        loadNave();
    }, []);

    const loadNave = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/naves/${id}/nave`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const nave = response.data.nave;
            
            // Preenche o formulário com os dados recebidos
            setFormData({
                id: nave.id,
                name: nave.name,
                price: nave.price,
                masLife: nave.masLife,
                status: nave.status,
                sprite: nave.sprite
            });
        } catch (error) {
            console.error("Erro ao carregar nave", error);
            alert("Nave não encontrada!");
            navigate('/naves');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            // Nota: Estamos enviando JSON normal, pois sua rota de update 
            // no backend atual não suporta upload de arquivo novo ainda.
            await axios.put('http://localhost:3000/naves/updateNave', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert('Nave atualizada com sucesso!');
            navigate('/naves'); // Volta para os cards
        } catch (error) {
            console.error("Erro ao atualizar:", error);
            alert("Erro ao atualizar nave.");
        }
    };

    // Estilos (reutilizando lógica simples)
    const styles = {
        container: { maxWidth: '500px', margin: '2rem auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' },
        inputGroup: { marginBottom: '15px' },
        label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
        input: { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
        button: { width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
        cancelBtn: { display: 'block', textAlign: 'center', marginTop: '10px', color: '#666' },
        previewImg: { width: '100px', marginTop: '5px', borderRadius: '5px' }
    };

    return (
        <div style={styles.container}>
            <h2>Editar Nave #{id}</h2>
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
                    <label style={styles.label}>Vida Máxima:</label>
                    <input type="number" name="masLife" value={formData.masLife} onChange={handleChange} style={styles.input} />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Status:</label>
                    <select name="status" value={formData.status} onChange={handleChange} style={styles.input}>
                        <option value="A">Ativo</option>
                        <option value="D">Desativado</option>
                    </select>
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Imagem Atual:</label>
                    {formData.sprite && (
                        <img 
                            src={`http://localhost:3000/imagens/${formData.sprite}`} 
                            alt="Sprite atual" 
                            style={styles.previewImg} 
                        />
                    )}
                    <p style={{fontSize: '0.8rem', color: '#666'}}>
                        * Para trocar a imagem, delete e crie novamente (ou atualize o backend).
                    </p>
                </div>

                <button type="submit" style={styles.button}>Salvar Alterações</button>
            </form>
            
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/naves'); }} style={styles.cancelBtn}>
                Cancelar
            </a>
        </div>
    );
};

export default EditNave;