import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
// O CSS é global (App.css)

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Estado para os dados de texto
    const [formData, setFormData] = useState({
        id: '',
        nickname: '',
        email: '',
        profilePic: '' // Nome do arquivo vindo do banco
    });

    // Estado para o arquivo de imagem selecionado
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null); // URL para mostrar o preview local

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/user/${id}/get`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const u = response.data.usuario;
            
            setFormData({
                id: u.id,
                nickname: u.nickname,
                email: u.email,
                profilePic: u.profilePic
            });

            // Se o usuário já tiver foto, define como preview inicial
            // Assumindo que a rota estática '/imagens' aponta para 'public/uploads' como nos Shots
            if (u.profilePic) {
                setPreview(`http://localhost:3000/imagens/${u.profilePic}`);
            }

        } catch (error) {
            console.error("Erro ao carregar usuário", error);
            navigate('/users'); // ou a rota que você usa para listar usuários
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Lida com a seleção do arquivo
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file)); // Cria URL temporária para mostrar na hora
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            // 1. Atualiza os dados de texto (PUT)
            await axios.put(`http://localhost:3000/user/${id}/update`, {
                id: formData.id,
                nickname: formData.nickname,
                email: formData.email
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // 2. Se houver uma nova imagem selecionada, faz o upload (POST)
            if (selectedFile) {
                const data = new FormData();
                data.append('profilePic', selectedFile); // O nome 'profilePic' deve bater com o upload.single do router

                await axios.post(`http://localhost:3000/user/${id}/avatar`, data, {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            alert('Perfil atualizado com sucesso!');
            navigate('/users'); // Voltar para a lista

        } catch (error) {
            console.error("Erro ao atualizar:", error);
            const msg = error.response?.data?.mensagem || "Erro ao atualizar perfil.";
            alert(msg);
        }
    };

    return (
        <div className="form-page-container">
            <div className="form-card-neon">
                
                <h2 className="form-title">EDITAR PERFIL #{id}</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-grid-layout">
                        
                        {/* --- COLUNA DA ESQUERDA (DADOS) --- */}
                        <div className="form-fields">
                            <div className="form-group">
                                <label className="input-label">Nickname</label>
                                <input 
                                    type="text" 
                                    name="nickname" 
                                    className="input-modern"
                                    value={formData.nickname} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label className="input-label">Email</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    className="input-modern"
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                        </div>

                        {/* --- COLUNA DA DIREITA (FOTO DE PERFIL) --- */}
                        <div className="image-upload-area">
                            <label className="input-label">FOTO DE PERFIL</label>
                            
                            {/* Caixa de Preview Clicável */}
                            <label htmlFor="fileInput" className="image-preview-box" style={{ cursor: 'pointer' }}>
                                {preview ? (
                                    <img 
                                        src={preview} 
                                        alt="Preview" 
                                        className="preview-img"
                                        style={{ objectFit: 'cover', borderRadius: '10px' }}
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Sem+Foto'; }}
                                    />
                                ) : (
                                    <div className="upload-placeholder">
                                        <span style={{fontSize: '2rem'}}>📷</span>
                                        <p>Clique para adicionar</p>
                                    </div>
                                )}
                            </label>
                            
                            {/* Input Invisível */}
                            <input 
                                id="fileInput"
                                type="file" 
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }} 
                            />
                            
                            <p style={{fontSize: '0.8rem', color: '#666', marginTop: '10px', textAlign: 'center'}}>
                                * Clique na imagem para alterar.
                            </p>
                        </div>

                    </div> {/* Fim do Grid */}

                    {/* --- BOTÕES DE AÇÃO --- */}
                    <div className="form-actions">
                        <button 
                            type="submit" 
                            className="btn-save"
                            style={{ background: 'linear-gradient(90deg, #007bff 0%, #0056b3 100%)', boxShadow: 'none' }}
                        >
                            SALVAR ALTERAÇÕES
                        </button>

                        <button 
                            type="button" 
                            className="btn-cancel"
                            onClick={() => navigate('/users')}
                        >
                            CANCELAR
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUser;