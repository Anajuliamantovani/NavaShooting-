import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
// O CSS global (App.css) deve conter as classes do Modal (veja abaixo)

const AtributoList = () => {
    const [atributos, setAtributos] = useState([]);
    
    // Estado para controlar o Modal Customizado
    const [modal, setModal] = useState({
        show: false,
        type: 'alert', // 'alert' ou 'confirm'
        title: '',
        message: '',
        onConfirm: null
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchAtributos();
    }, []);

    const fetchAtributos = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/atributos/allAtributes', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const listaOrdenada = response.data.atributos.sort((a, b) => a.id - b.id);
            setAtributos(listaOrdenada);
        } catch (error) {
            console.error("Erro ao buscar atributos:", error);
            // Poderíamos usar o modal de erro aqui também se quiséssemos
        }
    };

    // --- FUNÇÕES DO MODAL ---
    
    const closeModal = () => {
        setModal({ ...modal, show: false });
    };

    const showAlert = (title, message) => {
        setModal({
            show: true,
            type: 'alert',
            title,
            message,
            onConfirm: closeModal
        });
    };

    const showConfirm = (title, message, action) => {
        setModal({
            show: true,
            type: 'confirm',
            title,
            message,
            onConfirm: () => {
                action();
                closeModal();
            }
        });
    };

    // --- LÓGICA DE EXCLUSÃO ---

    const handleDeleteClick = (id) => {
        showConfirm(
            "CONFIRMAR EXCLUSÃO",
            "Tem certeza que deseja desintegrar este atributo do sistema?",
            () => deleteAtributo(id)
        );
    };

    const deleteAtributo = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete('http://localhost:3000/atributos/deleteAtribute', {
                headers: { 'Authorization': `Bearer ${token}` },
                data: { id: id } 
            });

            setAtributos(prev => prev.filter(item => item.id !== id));
            showAlert("SUCESSO", "Atributo excluído com sucesso!");

        } catch (error) {
            console.error("Erro ao excluir:", error);
            showAlert("ERRO DE SISTEMA", "Falha ao excluir o atributo.");
        }
    };

    return (
        <div className="nave-container">
            {/* Header */}
            <div className="user-header">
                <h2 className="shot-title">GERENCIAR ATRIBUTOS</h2>
            </div>

            {/* Grid de Cards */}
            <div className="user-grid">
                
                {/* 1. CARD DE ADICIONAR */}
                <Link 
                    to="/create-atributo" 
                    className="sci-fi-card"
                    style={{
                        textDecoration: 'none',
                        border: '2px dashed #802FFF',
                        backgroundColor: 'rgba(5, 0, 17, 0.3)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        minHeight: '200px',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(128, 47, 255, 0.1)';
                        e.currentTarget.style.transform = 'translateY(-5px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(5, 0, 17, 0.3)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    <div style={{ fontSize: '4rem', color: '#802FFF', marginBottom: '10px', fontWeight: 'bold' }}>+</div>
                    <span style={{ color: '#802FFF', fontFamily: "'Orbitron', sans-serif", fontSize: '1.2rem', letterSpacing: '2px', textTransform: 'uppercase' }}>ADICIONAR</span>
                </Link>

                {/* 2. LOOP DOS CARDS */}
                {atributos.map((atrib) => (
                    <div key={atrib.id} className="sci-fi-card">
                        
                        <div className="card-info-section" style={{ marginTop: '20px' }}>
                            <h3 className="sci-fi-title">ATRIBUTO #{atrib.id}</h3>
                            <p className="sci-fi-subtitle">Parâmetros de Jogo</p>
                            
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginBottom: '25px', width: '100%' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <span className="stat-label" style={{ marginBottom: '2px' }}>SPEED</span>
                                    <span className="stat-number text-cyan" style={{ fontSize: '1.2rem' }}>{atrib.speed}</span>
                                </div>
                                <div style={{ width: '1px', height: '25px', backgroundColor: '#444' }}></div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <span className="stat-label" style={{ marginBottom: '2px' }}>SCALE</span>
                                    <span className="stat-number text-gold" style={{ fontSize: '1.2rem' }}>{atrib.scale}</span>
                                </div>
                                <div style={{ width: '1px', height: '25px', backgroundColor: '#444' }}></div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <span className="stat-label" style={{ marginBottom: '2px' }}>ESCUDO</span>
                                    <span className="stat-number" style={{ fontSize: '1.2rem', color: atrib.shield ? '#28a745' : '#ff3333' }}>
                                        {atrib.shield ? 'ON' : 'OFF'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="card-footer-actions">
                            <button className="footer-btn btn-edit-text" onClick={() => navigate(`/edit-atributo/${atrib.id}`)}>EDITAR</button>
                            <div className="footer-divider"></div>
                            <button className="footer-btn btn-deactivate-text" onClick={() => handleDeleteClick(atrib.id)}>EXCLUIR</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- COMPONENTE MODAL CUSTOMIZADO --- */}
            {modal.show && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal-box">
                        <h3 className="modal-title">{modal.title}</h3>
                        <p className="modal-message">{modal.message}</p>
                        
                        <div className="modal-actions">
                            {modal.type === 'confirm' && (
                                <button className="modal-btn btn-cancel" onClick={closeModal}>
                                    CANCELAR
                                </button>
                            )}
                            <button className="modal-btn btn-confirm" onClick={modal.onConfirm}>
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AtributoList;