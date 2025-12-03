import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RankingList = () => {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRanking();
    }, []);

    const fetchRanking = async () => {
        try {
            const token = localStorage.getItem('token');
            // Chama a rota específica de ranking que você já criou
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

    // Função auxiliar para dar cor aos troféus
    const getRankStyle = (index) => {
        switch(index) {
            case 0: return { color: '#FFD700', fontSize: '1.5rem', textShadow: '0 0 10px #FFD700' }; // Ouro
            case 1: return { color: '#C0C0C0', fontSize: '1.4rem', textShadow: '0 0 10px #C0C0C0' }; // Prata
            case 2: return { color: '#CD7F32', fontSize: '1.3rem', textShadow: '0 0 10px #CD7F32' }; // Bronze
            default: return { color: '#fff', fontSize: '1.1rem' }; // Resto
        }
    };

    const getRankIcon = (index) => {
        switch(index) {
            case 0: return '👑';
            case 1: return '🥈';
            case 2: return '🥉';
            default: return `#${index + 1}`;
        }
    };

    return (
        <div className="page-container">
            <div className="header-flex" style={{justifyContent: 'center'}}>
                <h2 style={{ fontSize: '2.5rem' }}>🏆 Ranking Global 🏆</h2>
            </div>

            <div className="list-container" style={{maxWidth: '800px', margin: '0 auto'}}>
                {loading && <p style={{textAlign: 'center'}}>Carregando ranking...</p>}
                
                {!loading && ranking.length === 0 && (
                    <p style={{textAlign: 'center'}}>Nenhum jogador pontuou ainda.</p>
                )}

                {ranking.map((user, index) => (
                    <div key={index} className="list-card" style={{ borderLeftWidth: '6px', borderColor: index < 3 ? getRankStyle(index).color : '#8a2be2' }}>
                        
                        {/* LADO ESQUERDO: Posição + Nome */}
                        <div className="info-side" style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                            
                            {/* Posição (1º, 2º...) */}
                            <div style={{ 
                                ...getRankStyle(index), 
                                fontWeight: 'bold', 
                                minWidth: '50px', 
                                textAlign: 'center' 
                            }}>
                                {getRankIcon(index)}
                            </div>

                            {/* Nickname */}
                            <div>
                                <h3 className="card-title" style={{margin: 0, fontSize: index === 0 ? '1.5rem' : '1.2rem'}}>
                                    {user.nickname}
                                </h3>
                                {/* Se quiser mostrar o email, descomente abaixo */}
                                {/* <small style={{color: '#888'}}>{user.email}</small> */}
                            </div>
                        </div>

                        {/* LADO DIREITO: Score */}
                        <div className="btn-group" style={{alignItems: 'center'}}>
                            <div style={{textAlign: 'right'}}>
                                <span style={{display: 'block', color: '#bf55ec', fontSize: '0.8rem', textTransform: 'uppercase'}}>Score Total</span>
                                <span style={{fontSize: '1.8rem', fontWeight: 'bold', color: '#fff'}}>
                                    {user.score}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div style={{marginTop: '30px', textAlign: 'center'}}>
                <Link to="/" className="nav-link">Voltar ao Menu Principal</Link>
            </div>
        </div>
    );
};

export default RankingList;