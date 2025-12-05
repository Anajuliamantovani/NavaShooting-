import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
// A importação do CSS foi removida para evitar erros de caminho. 
// Certifique-se de que o seu App.css está importado no main.jsx ou App.jsx.

const EditShot = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        price: '',
        damage: '',
        status: 'A',
        sprite: ''
    });

    useEffect(() => {
        loadShot();
    }, []);

    const loadShot = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/shots/${id}/shot`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const shot = response.data.shot;
            
            setFormData({
                id: shot.id,
                name: shot.name,
                price: shot.price,
                damage: shot.damage,
                status: shot.status,
                sprite: shot.sprite
            });
        } catch (error) {
            console.error("Erro ao carregar shot", error);
            alert("Shot não encontrado!");
            navigate('/shots');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            await axios.put('http://localhost:3000/shots/attShot', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert('Shot atualizado com sucesso!');
            navigate('/shots'); 
        } catch (error) {
            console.error("Erro ao atualizar:", error);
            alert("Erro ao atualizar shot.");
        }
    };

    return (
        <div className="form-page-container">
            <div className="form-card-neon">
                
                <h2 className="form-title">EDITAR SHOT #{id}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid-layout">
                        
                        {/* --- COLUNA DA ESQUERDA (DADOS) --- */}
                        <div className="form-fields">
                            
                            {/* Nome */}
                            <div className="form-group">
                                <label className="input-label">Nome</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    className="input-modern"
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>

                            {/* Preço */}
                            <div className="form-group">
                                <label className="input-label">Preço</label>
                                <input 
                                    type="number" 
                                    name="price" 
                                    className="input-modern"
                                    value={formData.price} 
                                    onChange={handleChange} 
                                />
                            </div>

                            {/* Dano (Específico de Shot) */}
                            <div className="form-group">
                                <label className="input-label">Dano (Damage)</label>
                                <input 
                                    type="number" 
                                    name="damage" 
                                    className="input-modern"
                                    value={formData.damage} 
                                    onChange={handleChange} 
                                />
                            </div>

                            {/* Status */}
                            <div className="form-group">
                                <label className="input-label">Status</label>
                                <select 
                                    name="status" 
                                    className="select-modern"
                                    value={formData.status} 
                                    onChange={handleChange}
                                >
                                    <option value="A">Ativo</option>
                                    <option value="D">Desativado</option>
                                </select>
                            </div>
                        </div>

                        {/* --- COLUNA DA DIREITA (IMAGEM ATUAL) --- */}
                        <div className="image-upload-area">
                            <label className="input-label">Imagem Atual</label>
                            
                            {/* Caixa que mostra a imagem atual */}
                            <div className="image-preview-box" style={{cursor: 'default'}}>
                                {formData.sprite ? (
                                    <img 
                                        src={`http://localhost:3000/imagens/${formData.sprite}`} 
                                        alt="Sprite atual" 
                                        className="preview-img"
                                    />
                                ) : (
                                    <div className="upload-placeholder">
                                        <p>Sem imagem</p>
                                    </div>
                                )}
                            </div>
                            
                            <p style={{fontSize: '0.8rem', color: '#666', marginTop: '10px', textAlign: 'center'}}>
                                * Para trocar a imagem, delete e crie novamente (ou atualize o backend).
                            </p>
                        </div>

                    </div> {/* Fim do Grid */}

                    {/* BOTÕES DE AÇÃO */}
                    <div className="form-actions">
                        {/* Botão Azul para combinar com a Nave */}
                        <button 
                            type="submit" 
                            className="btn-save"
                            style={{ background: 'linear-gradient(90deg, #007bff 0%, #0056b3 100%)', boxShadow: '0 5px 15px rgba(0, 123, 255, 0.3)' }}
                        >
                            SALVAR ALTERAÇÕES
                        </button>

                        <button 
                            type="button"
                            className="btn-cancel"
                            onClick={() => navigate('/shots')}
                        >
                            CANCELAR
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditShot;