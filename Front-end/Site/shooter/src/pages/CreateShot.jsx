import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css'; // Importa o CSS Sci-Fi

const CreateShot = () => {
    const navigate = useNavigate();
    
    // Estado dos dados do formulário
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        damage: '',
        status: 'A'
    });
    
    // Estado para o arquivo e o preview visual
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);

    // Atualiza os campos de texto
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Lida com a seleção da imagem e gera o preview
    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file)); // Mostra a imagem na tela instantaneamente
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Cria o FormData para enviar arquivo + texto
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
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data' // Importante para upload
                }
            });

            alert('Shot criado com sucesso!');
            navigate('/shots'); // Volta para a lista

        } catch (error) {
            console.error("Erro ao criar shot:", error);
            alert('Erro ao criar shot.');
        }
    };

    // ... (parte de cima do código continua igual)

    return (
        <div className="form-page-container">
            <div className="form-card-neon">
                
                <h2 className="form-title">NOVO SHOT (TIRO)</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid-layout">
                        
                        {/* ESQUERDA */}
                        <div className="form-fields">
                            <div className="form-group">
                                <label className="input-label">Nome do Shot</label>
                                <input type="text" name="name" className="input-modern" placeholder="Ex: Laser Blaster" onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label className="input-label">Dano (Damage)</label>
                                <input type="number" name="damage" className="input-modern" placeholder="Ex: 50" onChange={handleChange} />
                            </div>

                            <div className="form-group">
                                <label className="input-label">Preço</label>
                                <input type="number" name="price" className="input-modern" placeholder="Ex: 1000" onChange={handleChange} />
                            </div>

                            {/* O Select agora vai ocupar 100% igual aos inputs */}
                            <div className="form-group">
                                <label className="input-label">Status Inicial</label>
                                <select name="status" className="select-modern" onChange={handleChange}>
                                    <option value="A">ATIVO</option>
                                    <option value="D">DESATIVADO</option>
                                </select>
                            </div>
                        </div>

                        {/* DIREITA - Título centralizado pelo CSS */}
                        <div className="image-upload-area">
                            <label className="input-label">Sprite do Tiro</label>
                            
                            <label htmlFor="file-upload" className="image-preview-box">
                                {preview ? (
                                    <img src={preview} alt="Preview" className="preview-img" />
                                ) : (
                                    <div className="upload-placeholder">
                                        <span className="upload-icon">📷</span>
                                        <p>Clique para selecionar imagem</p>
                                    </div>
                                )}
                            </label>
                            <input id="file-upload" type="file" accept="image/*" className="file-input-hidden" onChange={handleFile} />
                        </div>

                    </div>

                    {/* BOTÕES DE AÇÃO */}
                    <div className="form-actions">
                        <button type="submit" className="btn-save">
                            REGISTRAR SHOT
                        </button>

                        <Link to="/shots" className="btn-cancel">
                            Cancelar e Voltar
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateShot;