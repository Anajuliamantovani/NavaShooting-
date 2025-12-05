import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../App.css'; // Importa o estilo global Sci-Fi

const EditAtributo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        id: '',
        speed: '',
        scale: '',
        shield: 'false'
    });

    useEffect(() => {
        loadAtributo();
    }, []);

    const loadAtributo = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/atributos/${id}/atribute`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = response.data.atributo;
            
            setFormData({
                id: data.id,
                speed: data.speed,
                scale: data.scale,
                shield: data.shield ? 'true' : 'false'
            });
        } catch (error) {
            console.error("Erro ao carregar", error);
            navigate('/atributos');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const payload = {
            id: formData.id,
            speed: parseFloat(formData.speed),
            scale: parseFloat(formData.scale),
            shield: formData.shield === 'true'
        };

        try {
            await axios.put('http://localhost:3000/atributos/updateAtribute', payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert('Atributo atualizado com sucesso!');
            navigate('/atributos'); 
        } catch (error) {
            console.error("Erro ao atualizar:", error);
            alert("Erro ao atualizar atributo.");
        }
    };

    return (
        <div className="form-page-container">
            {/* Usamos o mesmo card, mas limitamos a largura pois não tem imagem */}
            <div className="form-card-neon" style={{ maxWidth: '600px' }}>
                
                <h2 className="form-title">EDITAR ATRIBUTO #{id}</h2>

                <form onSubmit={handleSubmit}>
                    
                    {/* Como não tem imagem, usamos uma coluna única estilizada */}
                    <div className="form-fields">
                        
                        <div className="form-group">
                            <label className="input-label">Velocidade (Speed)</label>
                            <input 
                                type="number" 
                                step="0.1" 
                                name="speed" 
                                className="input-modern"
                                placeholder="Ex: 1.5"
                                value={formData.speed} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label className="input-label">Escala (Scale)</label>
                            <input 
                                type="number" 
                                step="0.1" 
                                name="scale" 
                                className="input-modern"
                                placeholder="Ex: 1.0"
                                value={formData.scale} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label className="input-label">Possui Escudo (Shield)?</label>
                            <select 
                                name="shield" 
                                className="select-modern"
                                value={formData.shield} 
                                onChange={handleChange}
                            >
                                <option value="false">Não</option>
                                <option value="true">Sim</option>
                            </select>
                        </div>

                    </div>

                    {/* BOTÕES DE AÇÃO */}
                    <div className="form-actions">
                        <button 
                            type="submit" 
                            className="btn-save"
                            style={{ background: 'linear-gradient(90deg, #007bff 0%, #0056b3 100%)', boxShadow: '0 5px 15px rgba(0, 123, 255, 0.3)' }}
                        >
                            SALVAR ALTERAÇÕES
                        </button>

                        <Link to="/atributos" className="btn-cancel">
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAtributo;