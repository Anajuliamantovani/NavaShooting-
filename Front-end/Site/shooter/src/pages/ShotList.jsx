import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

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
            // Ordena por ID
            const sortedShots = response.data.shots.sort((a, b) => a.id - b.id);
            setShots(sortedShots);
        } catch (error) {
            console.error("Erro ao buscar shots:", error);
            // alert("Erro ao carregar lista de shots."); // Opcional
        }
    };

    const toggleStatus = async (shot) => {
        const token = localStorage.getItem('token');
        const url = shot.status === 'A' 
            ? 'http://localhost:3000/shots/deactivateShot' 
            : 'http://localhost:3000/shots/activateShot';

        try {
            await axios.post(url, { id: shot.id }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchShots(); 
        } catch (error) {
            console.error("Erro ao alterar status:", error);
            alert("Erro ao alterar status do shot.");
        }
    };

    const styles = {
        container: { padding: '20px', maxWidth: '1000px', margin: '0 auto' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
        addButton: { padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' },
        grid: { display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' },
        card: { border: '1px solid #ccc', borderRadius: '8px', padding: '15px', width: '220px', textAlign: 'center', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
        image: { width: '100%', height: '150px', objectFit: 'contain', marginBottom: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' },
        name: { margin: '10px 0', fontSize: '1.2rem', color: '#333' },
        stats: { fontSize: '0.9rem', color: '#555', margin: '5px 0' },
        status: (status) => ({ color: status === 'A' ? 'green' : 'red', fontWeight: 'bold', marginBottom: '10px' }),
        buttonGroup: { display: 'flex', justifyContent: 'space-between', marginTop: '10px' },
        btnEdit: { backgroundColor: '#ffc107', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', color: '#000' },
        btnToggle: (status) => ({ backgroundColor: status === 'A' ? '#dc3545' : '#17a2b8', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', color: '#fff' })
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2>Gerenciar Shots (Tiros)</h2>
                <Link to="/create-shot" style={styles.addButton}>+ Adicionar Shot</Link>
            </div>

            <div style={styles.grid}>
                {shots.map((shot) => (
                    <div key={shot.id} style={styles.card}>
                        <img 
                            src={`http://localhost:3000/imagens/${shot.sprite}`} 
                            alt={shot.name} 
                            style={styles.image} 
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Sem+Img'; }}
                        />
                        
                        <h3 style={styles.name}>#{shot.id} - {shot.name}</h3>
                        <p style={styles.stats}>Dano: {shot.damage}</p>
                        <p style={styles.stats}>Preço: {shot.price}</p>
                        <p style={styles.status(shot.status)}>
                            {shot.status === 'A' ? 'ATIVO' : 'DESATIVADO'}
                        </p>

                        <div style={styles.buttonGroup}>
                            <button 
                                style={styles.btnEdit} 
                                onClick={() => navigate(`/edit-shot/${shot.id}`)}
                            >
                                ✏️ Editar
                            </button>
                            
                            <button 
                                style={styles.btnToggle(shot.status)} 
                                onClick={() => toggleStatus(shot)}
                            >
                                {shot.status === 'A' ? 'Desabilitar' : 'Habilitar'}
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

export default ShotList;