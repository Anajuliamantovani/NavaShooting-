import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const AtributoList = () => {
    const [atributos, setAtributos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAtributos();
    }, []);

    const fetchAtributos = async () => {
        try {
            // Se tiver autenticação no futuro, o header já está pronto
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/atributos/allAtributes', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            // Ordena por ID
            const listaOrdenada = response.data.atributos.sort((a, b) => a.id - b.id);
            setAtributos(listaOrdenada);
        } catch (error) {
            console.error("Erro ao buscar atributos:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir este atributo?")) return;

        const token = localStorage.getItem('token');
        try {
            // ATENÇÃO: Para enviar BODY no DELETE com Axios, usamos a propriedade 'data'
            await axios.delete('http://localhost:3000/atributos/deleteAtribute', {
                headers: { 'Authorization': `Bearer ${token}` },
                data: { id: id } 
            });

            // Remove o item da lista visualmente sem precisar recarregar a página
            setAtributos(atributos.filter(item => item.id !== id));
            alert("Atributo excluído com sucesso!");

        } catch (error) {
            console.error("Erro ao excluir:", error);
            alert("Erro ao excluir atributo.");
        }
    };

    // Estilos para o formato de Lista
    const styles = {
        container: { padding: '20px', maxWidth: '800px', margin: '0 auto' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
        addButton: { padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' },
        listContainer: { display: 'flex', flexDirection: 'column', gap: '15px' },
        
        // O Card Retangular Horizontal
        card: { 
            display: 'flex', 
            justifyContent: 'space-between', // Separa Esquerda e Direita
            alignItems: 'center', 
            border: '1px solid #ccc', 
            borderRadius: '8px', 
            padding: '20px', 
            backgroundColor: '#fff', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)' 
        },
        infoSide: { display: 'flex', flexDirection: 'column', gap: '5px' },
        title: { fontSize: '1.2rem', margin: 0, color: '#333' },
        details: { fontSize: '0.9rem', color: '#666' },
        
        btnGroup: { display: 'flex', gap: '10px' },
        btnEdit: { backgroundColor: '#ffc107', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', color: '#000', fontWeight: 'bold' },
        btnDelete: { backgroundColor: '#dc3545', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', color: '#fff', fontWeight: 'bold' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2>Gerenciar Atributos</h2>
                <Link to="/create-atributo" style={styles.addButton}>+ Novo Atributo</Link>
            </div>

            <div style={styles.listContainer}>
                {atributos.map((atrib) => (
                    <div key={atrib.id} style={styles.card}>
                        {/* Lado Esquerdo: Informações */}
                        <div style={styles.infoSide}>
                            <h3 style={styles.title}>Atributo #{atrib.id}</h3>
                            <span style={styles.details}>
                                <strong>Velocidade:</strong> {atrib.speed} | 
                                <strong> Escala:</strong> {atrib.scale} | 
                                <strong> Escudo:</strong> {atrib.shield ? 'Sim' : 'Não'}
                            </span>
                        </div>

                        {/* Lado Direito: Botões */}
                        <div style={styles.btnGroup}>
                            <button 
                                style={styles.btnEdit} 
                                onClick={() => navigate(`/edit-atributo/${atrib.id}`)}
                            >
                                Editar
                            </button>
                            <button 
                                style={styles.btnDelete} 
                                onClick={() => handleDelete(atrib.id)}
                            >
                                Excluir
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

export default AtributoList;