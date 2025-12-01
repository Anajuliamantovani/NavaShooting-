import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const NaveList = () => {
    const [naves, setNaves] = useState([]);
    const navigate = useNavigate();

    // Busca as naves ao carregar a página
    useEffect(() => {
        fetchNaves();
    }, []);

    const fetchNaves = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/naves/allNaves', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // Ordena por ID como você pediu
            const sortedNaves = response.data.naves.sort((a, b) => a.id - b.id);
            setNaves(sortedNaves);
        } catch (error) {
            console.error("Erro ao buscar naves:", error);
            alert("Erro ao carregar lista de naves.");
        }
    };

    // Função para Alternar Status (Ativar/Desativar)
    const toggleStatus = async (nave) => {
        const token = localStorage.getItem('token');
        const url = nave.status === 'A' 
            ? 'http://localhost:3000/naves/desactivateNave' 
            : 'http://localhost:3000/naves/activateNave';

        try {
            await axios.post(url, { id: nave.id }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // Recarrega a lista para mostrar o novo status
            fetchNaves(); 
        } catch (error) {
            console.error("Erro ao alterar status:", error);
            alert("Erro ao alterar status da nave.");
        }
    };

    // Estilos
    const styles = {
        container: { padding: '20px', maxWidth: '1000px', margin: '0 auto' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
        addButton: { padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' },
        grid: { display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' },
        card: { border: '1px solid #ccc', borderRadius: '8px', padding: '15px', width: '220px', textAlign: 'center', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
        image: { width: '100%', height: '150px', objectFit: 'contain', marginBottom: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' },
        name: { margin: '10px 0', fontSize: '1.2rem', color: '#333' },
        status: (status) => ({ color: status === 'A' ? 'green' : 'red', fontWeight: 'bold', marginBottom: '10px' }),
        buttonGroup: { display: 'flex', justifyContent: 'space-between', marginTop: '10px' },
        btnEdit: { backgroundColor: '#ffc107', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', color: '#000' },
        btnToggle: (status) => ({ backgroundColor: status === 'A' ? '#dc3545' : '#17a2b8', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', color: '#fff' })
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2>Gerenciar Naves</h2>
                <Link to="/create-nave" style={styles.addButton}>+ Adicionar Nave</Link> 
            </div>

            <div style={styles.grid}>
                {naves.map((nave) => (
                    <div key={nave.id} style={styles.card}>
                        {/* Exibe a imagem buscando da pasta estática do Node */}
                        <img 
                            src={`http://localhost:3000/imagens/${nave.sprite}`} 
                            alt={nave.name} 
                            style={styles.image} 
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Sem+Imagem'; }} // Fallback se imagem não existir
                        />
                        
                        <h3 style={styles.name}>#{nave.id} - {nave.name}</h3>
                        <p>Preço: {nave.price}</p>
                        <p style={styles.status(nave.status)}>
                            {nave.status === 'A' ? 'ATIVO' : 'DESATIVADO'}
                        </p>

                        <div style={styles.buttonGroup}>
                            <button 
                                style={styles.btnEdit} 
                                onClick={() => navigate(`/edit-nave/${nave.id}`)}
                            >
                                ✏️ Editar
                            </button>
                            
                            <button 
                                style={styles.btnToggle(nave.status)} 
                                onClick={() => toggleStatus(nave)}
                            >
                                {nave.status === 'A' ? 'Desabilitar' : 'Habilitar'}
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

export default NaveList;