import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css'; // Estilo Sci-Fi

const CreatePowerUp = () => {
    const navigate = useNavigate();
    
    // Estado do formulário
    const [formData, setFormData] = useState({
        name: '',
        status: 'A',
        shotId: '',
        atributoId: ''
    });
    
    // Listas para os selects
    const [availableShots, setAvailableShots] = useState([]);
    const [availableAttributes, setAvailableAttributes] = useState([]);
    
    // Imagem
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);

    // Carrega dados iniciais (Armas e Atributos disponíveis)
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            try {
                const resShots = await axios.get('http://localhost:3000/shots/allShots', config);
                // Filtra apenas armas ativas para o select
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
        
        // Só envia se tiver valor selecionado
        if (formData.shotId) dataToSend.append('shotId', formData.shotId);
        if (formData.atributoId) dataToSend.append('atributoId', formData.atributoId);
        
        if (imageFile) {
            dataToSend.append('sprite', imageFile);
        }

        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:3000/powerups/newPowerUp', dataToSend, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('PowerUp criado com sucesso!');
            navigate('/loja'); // ou /powerups
        } catch (error) {
            console.error("Erro ao criar:", error);
            alert('Erro ao criar PowerUp.');
        }
    };

    return (
        <div className="form-page-container">
            <div className="form-card-neon">
                
                <h2 className="form-title">NOVO POWERUP</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid-layout">
                        
                        {/* --- COLUNA DA ESQUERDA --- */}
                        <div className="form-fields">
                            
                            <div className="form-group">
                                <label className="input-label">Nome do PowerUp</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    className="input-modern"
                                    placeholder="Ex: Super Tiro"
                                    value={formData.name}
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label className="input-label">Concede Arma (Shot):</label>
                                <select 
                                    name="shotId" 
                                    className="select-modern"
                                    value={formData.shotId} 
                                    onChange={handleChange}
                                >
                                    <option value="">-- Nenhum --</option>
                                    {availableShots.map(shot => (
                                        <option key={shot.id} value={shot.id}>{shot.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="input-label">Concede Atributo:</label>
                                <select 
                                    name="atributoId" 
                                    className="select-modern"
                                    value={formData.atributoId} 
                                    onChange={handleChange}
                                >
                                    <option value="">-- Nenhum --</option>
                                    {availableAttributes.map(attr => (
                                        <option key={attr.id} value={attr.id}>
                                            ID #{attr.id} (Vel: {attr.speed})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="input-label">Status Inicial</label>
                                <select 
                                    name="status" 
                                    className="select-modern"
                                    value={formData.status} 
                                    onChange={handleChange}
                                >
                                    <option value="A">ATIVO</option>
                                    <option value="D">DESATIVADO</option>
                                </select>
                            </div>
                        </div>

                        {/* --- COLUNA DA DIREITA (IMAGEM) --- */}
                        <div className="image-upload-area">
                            <label className="input-label">Sprite (Imagem)</label>
                            
                            <label htmlFor="file-upload" className="image-preview-box">
                                {preview ? (
                                    <img src={preview} alt="Preview" className="preview-img" />
                                ) : (
                                    <div className="upload-placeholder">
                                        <span className="upload-icon">⚡</span>
                                        <p>Clique para selecionar imagem</p>
                                    </div>
                                )}
                            </label>
                            <input 
                                id="file-upload" 
                                type="file" 
                                accept="image/*" 
                                className="file-input-hidden"
                                onChange={handleFile}
                            />
                        </div>

                    </div> {/* Fim do Grid */}

                    {/* BOTÕES */}
                    <div className="form-actions">
                        <button type="submit" className="btn-save">
                            CRIAR POWERUP
                        </button>

                        <Link to="/loja" className="btn-cancel">
                            Cancelar e Voltar
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePowerUp;