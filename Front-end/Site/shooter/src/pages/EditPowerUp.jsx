import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
// Removemos a importação do CSS direto para evitar erros de build, assumindo que é global.

const EditPowerUp = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        status: '',
        shotId: '',
        atributoId: '',
        sprite: ''
    });

    const [availableShots, setAvailableShots] = useState([]);
    const [availableAttributes, setAvailableAttributes] = useState([]);

    useEffect(() => {
        if (id) {
            loadData();
        } else {
            alert("ID não identificado na URL!");
        }
    }, [id]);

    const loadData = async () => {
        const token = localStorage.getItem('token');
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        
        try {
            console.log("--- INICIANDO DIAGNÓSTICO DE CARREGAMENTO ---");

            // 1. TENTAR CARREGAR TIROS
            try {
                const resShots = await axios.get('http://localhost:3000/shots/allShots', config);
                setAvailableShots(resShots.data.shots.filter(s => s.status === 'A'));
                console.log("✅ Shots carregados com sucesso");
            } catch (err) {
                console.error("❌ Falha ao carregar Shots:", err);
                // Não paramos o código aqui, apenas avisamos no console, mas lançamos erro para o catch principal se for crítico
                throw new Error(`Erro na rota de SHOTS (/shots/allShots): ${err.message}`);
            }

            // 2. TENTAR CARREGAR ATRIBUTOS (Suspeita principal de erro de digitação)
            try {
                // VERIFIQUE NO SEU BACKEND SE A ROTA É 'allAtributes' (1 't') ou 'allAttributes' (2 't's)
                const resAttribs = await axios.get('http://localhost:3000/atributos/allAtributes', config);
                setAvailableAttributes(resAttribs.data.atributos);
                console.log("✅ Atributos carregados com sucesso");
            } catch (err) {
                console.error("❌ Falha ao carregar Atributos:", err);
                throw new Error(`Erro na rota de ATRIBUTOS (/atributos/allAtributes). Verifique se o nome está correto no Backend. Erro: ${err.message}`);
            }

            // 3. TENTAR CARREGAR O POWERUP
            let pu;
            try {
                // CORREÇÃO AQUI: A rota no backend é apenas /:id, removemos o /powerUp do final
                const resPowerUp = await axios.get(`http://localhost:3000/powerups/${id}`, config);
                pu = resPowerUp.data.powerUp;
                console.log("✅ PowerUp carregado com sucesso");
            } catch (err) {
                console.error("❌ Falha ao carregar PowerUp:", err);
                throw new Error(`Erro na rota de POWERUP (/powerups/${id}): ${err.message}`);
            }

            if (!pu) {
                throw new Error("O Backend retornou sucesso, mas o objeto 'powerUp' veio vazio.");
            }

            setFormData({
                id: pu.id,
                name: pu.name,
                status: pu.status,
                shotId: pu.shotId || '',
                atributoId: pu.atributoId || '',
                sprite: pu.sprite
            });

        } catch (error) {
            // Aqui mostramos o erro exato que foi gerado acima
            alert(error.message);
            // Comentei o navigate para você poder ler o erro na tela sem ela fechar
            // navigate('/powerups'); 
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.put('http://localhost:3000/powerups/attPowerUp', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('PowerUp atualizado com sucesso!');
            navigate('/powerups'); 
        } catch (error) {
            console.error("Erro ao atualizar:", error);
            const msg = error.response?.data?.message || error.message;
            alert(`Erro ao atualizar: ${msg}`);
        }
    };

    return (
        <div className="form-page-container">
            <div className="form-card-neon">
                
                <h2 className="form-title">EDITAR POWERUP #{id}</h2>

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

                            {/* Select Arma (Shot) */}
                            <div className="form-group">
                                <label className="input-label">Arma (Shot)</label>
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

                            {/* Select Atributo */}
                            <div className="form-group">
                                <label className="input-label">Atributo</label>
                                <select 
                                    name="atributoId" 
                                    className="select-modern"
                                    value={formData.atributoId} 
                                    onChange={handleChange}
                                >
                                    <option value="">-- Nenhum --</option>
                                    {availableAttributes.map(attr => (
                                        <option key={attr.id} value={attr.id}>
                                            {attr.name ? attr.name : `ID #${attr.id}`}
                                        </option>
                                    ))}
                                </select>
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
                        {/* Botão Azul */}
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
                            onClick={() => navigate('/powerups')}
                        >
                            CANCELAR
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPowerUp;