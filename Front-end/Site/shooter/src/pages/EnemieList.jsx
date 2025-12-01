import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const EnemieList = () => {
    const [enemies, setEnemies] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEnemies();
    }, []);

    const fetchEnemies = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/enemies/allEnemies', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            // --- DEBUG: Verifique isso no Console do Navegador (F12) ---
            console.log("Dados recebidos da API:", response.data); 
            
            setEnemies(response.data.enemies);
        } catch (error) {
            console.error("Erro ao buscar inimigos:", error);
            alert("Erro ao carregar lista. Verifique o console.");
        }
    };

    // Função NOVA: Igual à da Nave/Shot
    const toggleStatus = async (enemy) => {
        const token = localStorage.getItem('token');
        const url = enemy.status === 'A' 
            ? 'http://localhost:3000/enemies/desactivateEnemie' 
            : 'http://localhost:3000/enemies/activateEnemie';

        try {
            await axios.post(url, { id: enemy.id }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchEnemies(); // Recarrega a lista
        } catch (error) {
            console.error("Erro ao alterar status:", error);
            alert("Erro ao alterar status.");
        }
    };

    const styles = {
        container: { padding: '20px', maxWidth: '1200px', margin: '0 auto' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
        addButton: { padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' },
        grid: { display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' },
        card: { border: '1px solid #ccc', borderRadius: '8px', padding: '15px', width: '260px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'relative' },
        waveBadge: { position: 'absolute', top: '10px', right: '10px', backgroundColor: '#6f42c1', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem' },
        image: { width: '100%', height: '150px', objectFit: 'contain', marginBottom: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' },
        name: { margin: '5px 0', fontSize: '1.2rem', color: '#333', textAlign: 'center' },
        details: { fontSize: '0.9rem', color: '#555', lineHeight: '1.5' },
        status: (status) => ({ color: status === 'A' ? 'green' : 'red', fontWeight: 'bold', textAlign: 'center', display: 'block', margin: '10px 0' }),
        buttonGroup: { display: 'flex', justifyContent: 'space-between', marginTop: '15px' },
        btnEdit: { backgroundColor: '#ffc107', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', color: '#000', fontWeight: 'bold' },
        btnToggle: (status) => ({ backgroundColor: status === 'A' ? '#dc3545' : '#17a2b8', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', color: '#fff', fontWeight: 'bold' })
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2>Gerenciar Inimigos</h2>
                <Link to="/create-enemie" style={styles.addButton}>+ Novo Inimigo</Link>
            </div>

            <div style={styles.grid}>
                {enemies.length === 0 && <p>Nenhum inimigo encontrado.</p>}

                {enemies.map((enemy) => (
                    <div key={enemy.id} style={styles.card}>
                        <span style={styles.waveBadge}>Wave {enemy.wave}</span>
                        
                        <img 
                            src={`http://localhost:3000/imagens/${enemy.sprite}`} 
                            alt={enemy.name} 
                            style={styles.image} 
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Sem+Img'; }}
                        />
                        
                        <h3 style={styles.name}>{enemy.name}</h3>
                        
                        <div style={styles.details}>
                            <p><strong>Pontos:</strong> {enemy.score}</p>
                            <p><strong>Moedas:</strong> {enemy.coinsDropped}</p>
                            <p><strong>Movimento:</strong> {enemy.movement}</p>
                            <p><strong>Arma:</strong> {enemy.shot ? enemy.shot.name : '-'}</p>
                            <p><strong>Atributo:</strong> {enemy.atributo ? `#${enemy.atributo.id}` : '-'}</p>
                        </div>

                        {/* STATUS VISUAL */}
                        <span style={styles.status(enemy.status)}>
                            {enemy.status === 'A' ? 'ATIVO' : 'DESATIVADO'}
                        </span>

                        <div style={styles.buttonGroup}>
                            <button 
                                style={styles.btnEdit} 
                                onClick={() => navigate(`/edit-enemie/${enemy.id}`)}
                            >
                                Editar
                            </button>
                            
                            <button 
                                style={styles.btnToggle(enemy.status)} 
                                onClick={() => toggleStatus(enemy)}
                            >
                                {enemy.status === 'A' ? 'Desabilitar' : 'Habilitar'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            <div style={{marginTop: '30px', textAlign: 'center'}}>
                <Link to="/">Voltar ao Menu Principal</Link>
            </div>
        </div>
    );
};

export default EnemieList;