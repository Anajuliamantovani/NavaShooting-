import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'; 

const PowerUpList = () => {
    const [powerUps, setPowerUps] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPowerUps();
    }, []);

    const fetchPowerUps = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/powerups/allPowerUps', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setPowerUps(response.data.powerUps);
        } catch (error) {
            console.error("Erro ao buscar PowerUps:", error);
        }
    };

    const toggleStatus = async (item) => {
        const token = localStorage.getItem('token');
        const url = item.status === 'A' 
            ? 'http://localhost:3000/powerups/desactivatePowerUp' 
            : 'http://localhost:3000/powerups/activatePowerUp';

        try {
            await axios.post(url, { id: item.id }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchPowerUps(); 
        } catch (error) {
            console.error("Erro ao alterar status:", error);
            alert("Erro ao alterar status.");
        }
    };

    return (
        <div className="nave-container">
            <h2 className="powerup-title">GERENCIAR POWER-UPS</h2>

            <div className="powerup-grid">
                
                {/* 1. CARD ADICIONAR */}
                <Link to="/create-powerup" className="powerup-add-card">
                    <span className="plus-sign">+</span>
                    <span className="add-text">ADICIONAR</span>
                </Link>

                {/* 2. CARDS POWERUPS */}
                {powerUps.map((pu) => (
                    <div key={pu.id} className="powerup-card">
                        
                        {/* Imagem */}
                        <img 
                            src={`http://localhost:3000/imagens/${pu.sprite}`} 
                            alt={pu.name} 
                            className="powerup-image"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Sem+Img'; }}
                        />

                        {/* Badge */}
                        <span className={`status-badge ${pu.status === 'A' ? 'status-active' : 'status-inactive'}`}>
                            {pu.status === 'A' ? 'ATIVO' : 'DESATIVADO'}
                        </span>
                        
                        {/* Info */}
                        <div className="powerup-info">
                            <h3>{pu.name}</h3>
                            <p className="powerup-effect">
                                {pu.shot ? `Arma: ${pu.shot.name}` : (pu.atributo ? `Attr #${pu.atributo.id}` : 'Sem efeito')}
                            </p>
                        </div>

                        {/* Botões */}
                        <div className="nave-actions">
                            <button 
                                className="btn-card" 
                                onClick={() => navigate(`/edit-powerup/${pu.id}`)}
                            >
                                Editar
                            </button>
                            <button 
                                className="btn-card" 
                                onClick={() => toggleStatus(pu)}
                            >
                                {pu.status === 'A' ? 'Desativar' : 'Ativar'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PowerUpList;