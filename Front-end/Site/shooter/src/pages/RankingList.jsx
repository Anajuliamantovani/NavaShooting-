import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'; // Importando o CSS global

const RankingList = () => {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRanking();
    }, []);

    const fetchRanking = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/user/ranking', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setRanking(response.data.ranking);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao buscar ranking:", error);
            setLoading(false);
        }
    };

    return (
        <div className="leaderboard-container">
            
            <h1 className="leaderboard-title">LEADERBOARD</h1>

            {loading && <p className="loading-text">Carregando dados...</p>}

            {!loading && (
                <div className="ranking-table-structure">
                    
                    {/* CABEÇALHO (Alinhado perfeitamente com as linhas) */}
                    <div className="ranking-header">
                        <div className="col-rank">CLASSIFICAÇÃO</div>
                        <div className="col-score">PONTUAÇÃO</div>
                        <div className="col-name">PILOTO</div>
                    </div>

                    {/* LISTA DE JOGADORES */}
                    <div className="ranking-body">
                        {ranking.map((user, index) => (
                            <div key={index} className="ranking-row">
                                
                                {/* Coluna 1: #1, #2... */}
                                <div className="col-rank rank-number">
                                    #{index + 1}
                                </div>

                                {/* Coluna 2: 1000, 500... */}
                                <div className="col-score score-number">
                                    {user.score}
                                </div>

                                {/* Coluna 3: Nome */}
                                <div className="col-name user-name">
                                    {user.nickname}
                                </div>
                            </div>
                        ))}

                        {ranking.length === 0 && (
                            <p className="no-data">Nenhum registro encontrado.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RankingList;