import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
// O CSS é importado no App.jsx

const UserList = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/user/getAll', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const lista = response.data.usuarios || [];
            const sortedUsers = lista.sort((a, b) => a.id - b.id);
            setUsers(sortedUsers);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
        }
    };

    const toggleStatus = async (user) => {
        const token = localStorage.getItem('token');
        const url = user.status === 'A' 
            ? `http://localhost:3000/user/${user.id}/deactivate`
            : `http://localhost:3000/user/${user.id}/activate`;

        try {
            await axios.post(url, { id: user.id }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchUsers(); 
        } catch (error) {
            console.error("Erro ao alterar status:", error);
            const msg = error.response?.data?.message || error.message;
            alert(`Erro ao alterar status: ${msg}`);
        }
    };

    return (
        <div className="nave-container">
            {/* Header */}
            <div className="user-header">
                <h2 className="shot-title">BASE DE JOGADORES</h2>
            </div>

            {/* Grid */}
            <div className="user-grid">
                {users.map((user) => (
                    <div key={user.id} className="sci-fi-card">
                        
                        {/* 1. BADGE FLUTUANTE */}
                        <div className={`status-pill ${user.status === 'A' ? 'pill-active' : 'pill-inactive'}`}>
                            {user.status === 'A' ? 'ATIVO' : 'DESATIVADO'}
                        </div>

                        {/* 2. AVATAR (ESTILO SHOT) */}
                        <div className="card-avatar-section">
                            {/* Adicionei overflow: 'hidden' e position: 'relative' para garantir que a imagem é cortada */}
                            <div className="avatar-circle" style={{ overflow: 'hidden', position: 'relative' }}>
                                {user.profilePic ? (
                                    <img 
                                        src={`http://localhost:3000/imagens/${user.profilePic}`} 
                                        alt={`${user.nickname} avatar`}
                                        // O estilo da imagem garante que ela preencha o círculo e mantenha a proporção
                                        style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            objectFit: 'cover',
                                            position: 'absolute',
                                            top: '0',
                                            left: '0'
                                        }}
                                    />
                                ) : (
                                    // Adicionado para centralizar a letra caso não haja imagem
                                    <span style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                        {user.nickname.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* 3. INFO */}
                        <div className="card-info-section">
                            <h3 className="sci-fi-title">{user.nickname}</h3>
                            <p className="sci-fi-subtitle">{user.email}</p>
                            
                            {/* 4. STATS TRANSPARENTES E PRÓXIMOS (Modificado) */}
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '25px', marginBottom: '25px', width: '100%' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <span className="stat-label" style={{ marginBottom: '2px' }}>SCORE</span>
                                    <span className="stat-number text-cyan" style={{ fontSize: '1.2rem' }}>{user.score}</span>
                                </div>
                                
                                {/* Linha divisória vertical subtil */}
                                <div style={{ width: '1px', height: '25px', backgroundColor: '#444' }}></div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <span className="stat-label" style={{ marginBottom: '2px' }}>COINS</span>
                                    <span className="stat-number text-gold" style={{ fontSize: '1.2rem' }}>{user.coins}</span>
                                </div>
                            </div>
                        </div>

                        {/* 5. RODAPÉ DE AÇÕES DIVIDIDO */}
                        <div className="card-footer-actions">
                            <button 
                                className="footer-btn btn-edit-text"
                                onClick={() => navigate(`/edit-user/${user.id}`)}
                            >
                                EDITAR
                            </button>
                            
                            <div className="footer-divider"></div>
                            
                            <button 
                                className={`footer-btn ${user.status === 'A' ? 'btn-deactivate-text' : 'btn-activate-text'}`}
                                onClick={() => toggleStatus(user)}
                            >
                                {user.status === 'A' ? 'DESATIVAR' : 'ATIVAR'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserList;