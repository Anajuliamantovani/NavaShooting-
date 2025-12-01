import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

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

    const styles = {
        container: { padding: '20px', maxWidth: '1000px', margin: '0 auto' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
        addButton: { padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' },
        grid: { display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' },
        card: { border: '1px solid #ccc', borderRadius: '8px', padding: '15px', width: '250px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
        image: { width: '100%', height: '150px', objectFit: 'contain', marginBottom: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' },
        name: { margin: '5px 0', fontSize: '1.2rem', color: '#333', textAlign: 'center' },
        details: { fontSize: '0.85rem', color: '#555', lineHeight: '1.5' },
        status: (status) => ({ color: status === 'A' ? 'green' : 'red', fontWeight: 'bold', textAlign: 'center', display: 'block', margin: '10px 0' }),
        buttonGroup: { display: 'flex', justifyContent: 'space-between', marginTop: '15px' },
        btnEdit: { backgroundColor: '#ffc107', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', color: '#000' },
        btnToggle: (status) => ({ backgroundColor: status === 'A' ? '#dc3545' : '#17a2b8', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', color: '#fff' })
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2>Gerenciar PowerUps</h2>
                <Link to="/create-powerup" style={styles.addButton}>+ Novo PowerUp</Link>
            </div>

            <div style={styles.grid}>
                {powerUps.length === 0 && <p>Nenhum PowerUp cadastrado.</p>}

                {powerUps.map((pu) => (
                    <div key={pu.id} style={styles.card}>
                        <img 
                            src={`http://localhost:3000/imagens/${pu.sprite}`} 
                            alt={pu.name} 
                            style={styles.image} 
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Sem+Img'; }}
                        />
                        
                        <h3 style={styles.name}>{pu.name}</h3>
                        
                        <div style={styles.details}>
                            <p><strong>Dá Arma:</strong> {pu.shot ? pu.shot.name : 'Não'}</p>
                            <p><strong>Dá Atributo:</strong> {pu.atributo ? `#${pu.atributo.id}` : 'Não'}</p>
                        </div>

                        <span style={styles.status(pu.status)}>
                            {pu.status === 'A' ? 'ATIVO' : 'DESATIVADO'}
                        </span>

                        <div style={styles.buttonGroup}>
                            <button style={styles.btnEdit} onClick={() => navigate(`/edit-powerup/${pu.id}`)}>Editar</button>
                            <button style={styles.btnToggle(pu.status)} onClick={() => toggleStatus(pu)}>
                                {pu.status === 'A' ? 'Desabilitar' : 'Habilitar'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div style={{marginTop: '30px', textAlign: 'center'}}><Link to="/">Voltar ao Menu Principal</Link></div>
        </div>
    );
};

export default PowerUpList;