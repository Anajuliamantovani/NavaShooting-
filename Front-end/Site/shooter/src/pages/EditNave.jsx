import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../App.css'; // Importa o estilo global Sci-Fi

const EditNave = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        price: '',
        masLife: '',
        status: 'A',
        sprite: ''
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
            await axios.put('http://localhost:3000/naves/updateNave', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert('Nave atualizada com sucesso!');
            navigate('/naves'); 
        } catch (error) {
            console.error("Erro ao atualizar:", error);
            alert("Erro ao atualizar nave.");
        }
    };

    return (
        <div className="form-page-container">
            <div className="form-card-neon">
                
                <h2 className="form-title">EDITAR NAVE #{id}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid-layout">
                        
                        {/* --- COLUNA DA ESQUERDA (DADOS) --- */}
                        <div className="form-fields">
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

                            <div className="form-group">
                                <label className="input-label">Vida Máxima</label>
                                <input 
                                    type="number" 
                                    name="masLife" 
                                    className="input-modern"
                                    value={formData.masLife} 
                                    onChange={handleChange} 
                                />
                            </div>

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
                        {/* Botão Azul para diferenciar do Criar (Verde) */}
                        <button 
                            type="submit" 
                            className="btn-save"
                            style={{ background: 'linear-gradient(90deg, #007bff 0%, #0056b3 100%)', boxShadow: '0 5px 15px rgba(0, 123, 255, 0.3)' }}
                        >
                            SALVAR ALTERAÇÕES
                        </button>

                        <Link to="/naves" className="btn-cancel">
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditNave;