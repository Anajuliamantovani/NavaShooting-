import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

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
            // Ordena por ID
            const sortedUsers = response.data.usuarios.sort((a, b) => a.id - b.id);
            setUsers(sortedUsers);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            alert("Erro ao carregar lista de usuários.");
        }
    };

    const toggleStatus = async (user) => {
        const token = localStorage.getItem('token');
        
        // Determina a URL baseada no status atual
        // Nota: Sua rota espera o ID na URL, mas o controller espera no Body.
        // Vamos enviar nos dois para garantir.
        const url = user.status === 'A' 
            ? `http://localhost:3000/user/${user.id}/deactivate`
            : `http://localhost:3000/user/${user.id}/activate`;

        try {
            await axios.post(url, { id: user.id }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchUsers(); // Recarrega a lista
        } catch (error) {
            console.error("Erro ao alterar status:", error);
            alert("Erro ao alterar status do usuário.");
        }
    };

    // Função para deletar (caso queira usar no futuro)
    const handleDelete = async (id) => {
        if(!window.confirm("Tem certeza que deseja remover este usuário permanentemente?")) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:3000/user/${id}/remove`, {
                headers: { 'Authorization': `Bearer ${token}` },
                data: { id } // Controller pede ID no body
            });
            fetchUsers();
        } catch (error) {
            console.error("Erro ao deletar:", error);
        }
    };

    // Estilos (Layout Horizontal)
    const styles = {
        container: { padding: '20px', maxWidth: '900px', margin: '0 auto' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
        addButton: { padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' },
        listContainer: { display: 'flex', flexDirection: 'column', gap: '15px' },
        
        // Card Horizontal
        card: { 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            border: '1px solid #ccc', 
            borderRadius: '8px', 
            padding: '20px', 
            backgroundColor: '#fff', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)' 
        },
        infoSide: { display: 'flex', flexDirection: 'column', gap: '5px' },
        nickname: { fontSize: '1.2rem', margin: 0, color: '#333' },
        email: { fontSize: '0.9rem', color: '#666' },
        meta: { fontSize: '0.8rem', color: '#888' },
        
        statusBadge: (status) => ({
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            color: '#fff',
            backgroundColor: status === 'A' ? '#28a745' : '#dc3545',
            marginLeft: '10px'
        }),

        btnGroup: { display: 'flex', gap: '10px' },
        btnEdit: { backgroundColor: '#ffc107', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', color: '#000', fontWeight: 'bold' },
        btnToggle: (status) => ({ backgroundColor: status === 'A' ? '#dc3545' : '#17a2b8', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', color: '#fff', fontWeight: 'bold' })
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2>Gerenciar Usuários</h2>
                {/* Como a criação de usuário é o Registro, podemos mandar para lá ou criar um CreateUser específico */}
                <Link to="/register" style={styles.addButton}>+ Novo Usuário</Link>
            </div>

            <div style={styles.listContainer}>
                {users.map((user) => (
                    <div key={user.id} style={styles.card}>
                        {/* Lado Esquerdo */}
                        <div style={styles.infoSide}>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <h3 style={styles.nickname}>{user.nickname}</h3>
                                <span style={styles.statusBadge(user.status)}>
                                    {user.status === 'A' ? 'ATIVO' : 'INATIVO'}
                                </span>
                            </div>
                            <span style={styles.email}>{user.email}</span>
                            <span style={styles.meta}>
                                Permissão: <strong>{user.permission}</strong> | Score: {user.score} | Coins: {user.coins}
                            </span>
                        </div>

                        {/* Lado Direito */}
                        <div style={styles.btnGroup}>
                            <button 
                                style={styles.btnEdit} 
                                onClick={() => navigate(`/edit-user/${user.id}`)}
                            >
                                Editar
                            </button>
                            
                            <button 
                                style={styles.btnToggle(user.status)} 
                                onClick={() => toggleStatus(user)}
                            >
                                {user.status === 'A' ? 'Desativar' : 'Ativar'}
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

export default UserList;