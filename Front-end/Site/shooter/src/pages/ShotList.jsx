import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
// A importação do CSS foi removida para evitar erros de caminho.

const ShotList = () => {
    const [shots, setShots] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchShots();
    }, []);

    const fetchShots = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/shots/allShots', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            // Verificação de segurança caso response.data.shots venha nulo
            const listaShots = response.data.shots || [];
            const sortedShots = listaShots.sort((a, b) => a.id - b.id);
            setShots(sortedShots);
        } catch (error) {
            console.error("Erro ao buscar shots:", error);
        }
    };

    const toggleStatus = async (shot) => {
        const token = localStorage.getItem('token');
        
        // CORREÇÃO: Usamos 'deactivateShot' (sem o 's') para bater com o router do backend
        const url = shot.status === 'A' 
            ? 'http://localhost:3000/shots/deactivateShot' 
            : 'http://localhost:3000/shots/activateShot';

        try {
            // Enviamos tanto 'id' quanto 'shotId' para garantir compatibilidade
            const payload = { 
                id: shot.id, 
                shotId: shot.id 
            };

            await axios.post(url, payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            // Recarrega a lista para atualizar o botão
            fetchShots(); 
            
        } catch (error) {
            console.error("Erro detalhado ao alterar status:", error);
            const msg = error.response?.data?.message || error.message;
            alert(`Erro ao alterar status: ${msg}`);
        }
    };

    return (
        <div className="nave-container">
            <h2 className="shot-title">GERENCIAR SHOTS</h2>

            <div className="shot-grid">
                
                {/* 1. CARD ADICIONAR */}
                <Link to="/create-shot" className="shot-add-card">
                    <span className="plus-sign">+</span>
                    <span className="add-text">ADICIONAR</span>
                </Link>

                {/* 2. CARDS SHOTS */}
                {shots.map((shot) => (
                    <div key={shot.id} className="shot-card">
                        
                        {/* Imagem */}
                        <img 
                            src={`http://localhost:3000/imagens/${shot.sprite}`} 
                            alt={shot.name} 
                            className="shot-image"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Sem+Img'; }}
                        />

                        {/* Status Badge */}
                        <span className={`status-badge ${shot.status === 'A' ? 'status-active' : 'status-inactive'}`}>
                            {shot.status === 'A' ? 'ATIVO' : 'DESATIVADO'}
                        </span>
                        
                        {/* Informações */}
                        <div className="shot-info">
                            <h3>{shot.name}</h3>
                            <p className="shot-damage">Dano: {shot.damage}</p>
                            <p className="shot-damage">Preço: {shot.price}</p>
                        </div>

                        {/* Botões de Ação */}
                        <div className="nave-actions">
                            <button 
                                className="btn-card"
                                onClick={() => navigate(`/edit-shot/${shot.id}`)}
                            >
                                Editar
                            </button>
                            
                            <button 
                                className="btn-card"
                                onClick={() => toggleStatus(shot)}
                            >
                                {shot.status === 'A' ? 'Desativar' : 'Ativar'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShotList;