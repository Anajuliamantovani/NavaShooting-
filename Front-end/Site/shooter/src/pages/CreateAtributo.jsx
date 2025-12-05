import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// O CSS é global (App.css), então não precisa importar diretamente se já estiver no main

const CreateAtributo = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        speed: '',
        scale: '',
        shield: 'false' // Começa como string para o select
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        // Conversão de tipos antes de enviar
        const payload = {
            speed: parseFloat(formData.speed),
            scale: parseFloat(formData.scale),
            shield: formData.shield === 'true'
        };

        try {
            await axios.post('http://localhost:3000/atributos/newAtribute', payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert('Atributo criado com sucesso!');
            navigate('/atributos'); 

        } catch (error) {
            console.error("Erro ao criar:", error);
            const msg = error.response?.data?.message || error.message;
            alert(`Erro ao criar atributo: ${msg}`);
        }
    };

    return (
        <div className="form-page-container">
            {/* Limitamos a largura pois não há imagem lateral, para não ficar muito esticado */}
            <div className="form-card-neon" style={{ maxWidth: '600px' }}>
                
                <h2 className="form-title">NOVO ATRIBUTO</h2>
                
                <form onSubmit={handleSubmit}>
                    
                    {/* Campos do Formulário */}
                    <div className="form-fields">
                        
                        <div className="form-group">
                            <label className="input-label">Velocidade (Speed)</label>
                            <input 
                                type="number" 
                                step="0.1" 
                                name="speed" 
                                className="input-modern"
                                value={formData.speed} 
                                onChange={handleChange} 
                                placeholder="Ex: 1.5"
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
                                value={formData.scale} 
                                onChange={handleChange} 
                                placeholder="Ex: 0.5"
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

                    {/* Botões de Ação */}
                    <div className="form-actions" style={{ marginTop: '30px' }}>
                        <button 
                            type="submit" 
                            className="btn-save"
                            style={{ 
                                background: 'linear-gradient(90deg, #802FFF, #5e00b8)',
                                boxShadow: 'none' // Remove a sombra verde
                            }}
                        >
                            CRIAR ATRIBUTO
                        </button>

                        <button 
                            type="button" 
                            className="btn-cancel"
                            onClick={() => navigate('/atributos')}
                        >
                            CANCELAR
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CreateAtributo;