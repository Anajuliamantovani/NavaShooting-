import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css'; // Importa o estilo global Sci-Fi

const CreateNave = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        masLife: '',
        status: 'A'
    });
    
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    // Manipula mudança nos inputs de texto
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- Lógica de Arquivo e Drag & Drop ---
    const handleFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        } else {
            alert("Por favor, selecione apenas arquivos de imagem.");
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleInputFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    // --- Envio do Formulário ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = new FormData();
        dataToSend.append('name', formData.name);
        dataToSend.append('price', formData.price);
        dataToSend.append('masLife', formData.masLife);
        dataToSend.append('status', formData.status);
        if (imageFile) {
            dataToSend.append('sprite', imageFile);
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Você precisa estar logado para criar uma nave!');
            return;
        }

        try {
            await axios.post('http://localhost:3000/naves/newNave', dataToSend, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Nave criada com sucesso!');
            navigate('/naves'); // Volta para a lista de naves
        } catch (error) {
            console.error("Erro ao criar nave:", error);
            alert('Erro ao criar nave.');
        }
    };

    return (
        <div className="form-page-container">
            <div className="form-card-neon">
                
                <h2 className="form-title">REGISTRAR NOVA NAVE</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid-layout">
                        
                        {/* --- COLUNA DA ESQUERDA (DADOS) --- */}
                        <div className="form-fields">
                            
                            <div className="form-group">
                                <label className="input-label">Nome da Nave</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    className="input-modern"
                                    placeholder="Ex: Millennium Falcon"
                                    value={formData.name}
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label className="input-label">Preço</label>
                                <input 
                                    type="number" 
                                    name="price" 
                                    className="input-modern"
                                    placeholder="Ex: 5000"
                                    value={formData.price}
                                    onChange={handleChange} 
                                />
                            </div>

                            <div className="form-group">
                                <label className="input-label">Vida Máxima (masLife)</label>
                                <input 
                                    type="number" 
                                    name="masLife" 
                                    className="input-modern"
                                    placeholder="Ex: 200"
                                    value={formData.masLife}
                                    onChange={handleChange} 
                                />
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

                        {/* --- COLUNA DA DIREITA (IMAGEM DRAG & DROP) --- */}
                        <div className="image-upload-area">
                            <label className="input-label">Sprite da Nave</label>
                            
                            {/* Área de Drag & Drop estilizada */}
                            <label 
                                htmlFor="fileInput" 
                                className={`image-preview-box ${dragActive ? 'drag-active' : ''}`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                {preview ? (
                                    <img src={preview} alt="Preview" className="preview-img" />
                                ) : (
                                    <div className="upload-placeholder">
                                        <span className="upload-icon">🚀</span>
                                        <p>{dragActive ? "Solte a imagem aqui!" : "Arraste ou clique para selecionar"}</p>
                                    </div>
                                )}
                            </label>
                            
                            <input 
                                id="fileInput" 
                                type="file" 
                                className="file-input-hidden"
                                onChange={handleInputFileChange} 
                                accept="image/*"
                            />
                        </div>

                    </div> {/* Fim do Grid */}

                    {/* BOTÕES DE AÇÃO */}
                    <div className="form-actions">
                        <button type="submit" className="btn-save">
                            REGISTRAR NAVE
                        </button>

                        <Link to="/naves" className="btn-cancel">
                            Cancelar e Voltar
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateNave;