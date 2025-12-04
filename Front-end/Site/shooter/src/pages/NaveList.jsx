import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'; 

const NaveList = () => {
    const [naves, setNaves] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNaves();
    }, []);

    const fetchNaves = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/naves/allNaves', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const sortedNaves = response.data.naves.sort((a, b) => a.id - b.id);
            setNaves(sortedNaves);
        } catch (error) {
            console.error("Erro ao buscar naves:", error);
            alert("Erro ao carregar lista de naves.");
        }
    };

    const toggleStatus = async (nave) => {
        const token = localStorage.getItem('token');
        const url = nave.status === 'A' 
            ? 'http://localhost:3000/naves/desactivateNave' 
            : 'http://localhost:3000/naves/activateNave';

        try {
            await axios.post(url, { id: nave.id }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchNaves(); 
        } catch (error) {
            console.error("Erro ao alterar status:", error);
            alert("Erro ao alterar status da nave.");
        }
    };

    return (
        <div className="nave-container">
            <h2 className="nave-title">GERENCIAR NAVES</h2>

            <div className="nave-grid">
                
                {/* CARD ADICIONAR (Igual antes) */}
                <Link to="/create-nave" className="nave-add-card">
                    <span className="plus-sign">+</span>
                    <span className="add-text">ADICIONAR</span>
                </Link>

                {/* CARDS DAS NAVES (Novo Estilo) */}
                {naves.map((nave) => (
                    <div key={nave.id} className="nave-card">
                        
                        {/* Imagem com bordas arredondadas */}
                        <img 
                            src={`http://localhost:3000/imagens/${nave.sprite}`} 
                            alt={nave.name} 
                            className="nave-image"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Sem+Imagem'; }} 
                        />
                        
                        <div className="nave-info">
                            <h3>{nave.name}</h3>
                            <p className="nave-price">Preço: {nave.price}</p>
                            
                            {/* Badge centralizado roxo */}
                            <span className={`status-badge ${nave.status === 'A' ? 'status-active' : 'status-inactive'}`}>
                                {nave.status === 'A' ? 'ATIVO' : 'DESATIVADO'}
                            </span>
                        </div>

                        {/* Botões lado a lado */}
                        <div className="nave-actions">
                            <button 
                                className="btn-card"
                                onClick={() => navigate(`/edit-nave/${nave.id}`)}
                            >
                                Editar
                            </button>
                            
                            <button 
                                className="btn-card"
                                onClick={() => toggleStatus(nave)}
                            >
                                {nave.status === 'A' ? 'Desativar' : 'Ativar'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NaveList;