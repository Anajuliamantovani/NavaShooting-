import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; // Se não tiver, instale: npm install jwt-decode
// Ou use a lógica de pegar ID do localStorage se já estiver salvo lá

const Shop = () => {
    const [user, setUser] = useState(null);
    const [naves, setNaves] = useState([]);
    const [shots, setShots] = useState([]);
    
    // Inventário do Usuário (IDs do que ele comprou)
    const [myNaves, setMyNaves] = useState([]); 
    const [myShots, setMyShots] = useState([]);
    
    // Mochila (O que está equipado atualmente)
    const [myBag, setMyBag] = useState(null);

    const token = localStorage.getItem('token');
    
    // Pega o ID do usuário do token (decodificação simples)
    const getUserId = () => {
        if (!token) return null;
        try {
            const decoded = jwtDecode(token);
            return decoded.id;
        } catch (e) { return null; }
    };
    const userId = getUserId();

    useEffect(() => {
        if (userId) {
            loadAllData();
        }
    }, [userId]);

    const loadAllData = async () => {
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        
        try {
            // 1. Carregar Dados do Usuário (Coins)
            const resUser = await axios.get(`http://localhost:3000/user/${userId}/get`, config);
            setUser(resUser.data.usuario);

            // 2. Carregar Itens da Loja (Status Ativo)
            const resNaves = await axios.get('http://localhost:3000/naves/allNaves', config);
            setNaves(resNaves.data.naves.filter(n => n.status === 'A'));

            const resShots = await axios.get('http://localhost:3000/shots/allShots', config);
            setShots(resShots.data.shots.filter(s => s.status === 'A'));

            // 3. Carregar o que eu já comprei
            const resMyNaves = await axios.get(`http://localhost:3000/storeNave/user/${userId}`, config);
            setMyNaves(resMyNaves.data.storeNaves.map(item => item.naveId)); // Guarda só os IDs

            const resMyShots = await axios.get(`http://localhost:3000/storeShot/user/${userId}`, config);
            setMyShots(resMyShots.data.storeShots.map(item => item.shotId));

            // 4. Carregar Bag (Equipados)
            const resBag = await axios.get(`http://localhost:3000/bags/user/${userId}`, config);
            // A API retorna uma lista, pegamos a primeira (deve ter só 1 pela regra)
            if (resBag.data.bags && resBag.data.bags.length > 0) {
                setMyBag(resBag.data.bags[0]);
            }

        } catch (error) {
            console.error("Erro ao carregar loja:", error);
        }
    };

    // --- LÓGICA DE COMPRA ---
    const handleBuy = async (item, type) => {
        if (user.coins < item.price) {
            alert(`Você não tem moedas suficientes! Precisa de ${item.price}.`);
            return;
        }

        if (!window.confirm(`Deseja comprar ${item.name} por ${item.price} moedas?`)) return;

        const config = { headers: { 'Authorization': `Bearer ${token}` } };

        try {
            // 1. Debita Moedas (Usa addCoins com valor negativo)
            await axios.post(`http://localhost:3000/user/${userId}/coins`, {
                id: userId,
                coins: -item.price
            }, config);

            // 2. Adiciona na Tabela Store correspondente
            if (type === 'nave') {
                await axios.post('http://localhost:3000/storeNave/newStoreNave', { userId, naveId: item.id }, config);
            } else {
                await axios.post('http://localhost:3000/storeShot/newStoreShot', { userId, shotId: item.id }, config);
            }

            // 3. Recarrega tudo para atualizar a tela
            alert("Compra realizada com sucesso!");
            loadAllData();

        } catch (error) {
            console.error("Erro na compra:", error);
            alert("Erro ao processar compra.");
        }
    };

    // --- LÓGICA DE EQUIPAR ---
    const handleEquip = async (item, type) => {
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        
        try {
            // Chama a rota inteligente que criamos no backend
            await axios.post('http://localhost:3000/bags/equipItem', {
                userId,
                type, // 'nave' ou 'shot'
                itemId: item.id
            }, config);

            alert(`${item.name} equipado com sucesso!`);
            loadAllData();

        } catch (error) {
            console.error("Erro ao equipar:", error);
            alert("Erro ao equipar item.");
        }
    };

    // --- RENDERIZAÇÃO DOS BOTÕES ---
    const renderCardAction = (item, type) => {
        const isOwned = type === 'nave' ? myNaves.includes(item.id) : myShots.includes(item.id);
        
        // Verifica se está equipado na Bag atual
        let isEquipped = false;
        if (myBag) {
            if (type === 'nave' && myBag.naveId === item.id) isEquipped = true;
            if (type === 'shot' && myBag.shotId === item.id) isEquipped = true;
        }

        if (isEquipped) {
            return (
                <button className="btn" style={{backgroundColor: '#28a745', cursor: 'default', width: '100%'}} disabled>
                    EQUIPADO ✅
                </button>
            );
        }

        if (isOwned) {
            return (
                <button 
                    className="btn" 
                    style={{backgroundColor: '#00d2ff', width: '100%'}} 
                    onClick={() => handleEquip(item, type)}
                >
                    EQUIPAR
                </button>
            );
        }

        return (
            <button 
                className="btn" 
                style={{backgroundColor: '#8a2be2', width: '100%'}} 
                onClick={() => handleBuy(item, type)}
            >
                COMPRAR 💰 {item.price}
            </button>
        );
    };

    return (
        <div className="page-container">
            {/* CABEÇALHO DA LOJA */}
            <div className="header-flex">
                <div>
                    <h2>Loja Espacial</h2>
                    <p>Adquira equipamentos para melhorar sua jornada.</p>
                </div>
                <div style={{textAlign: 'right'}}>
                    <h3 style={{color: '#FFD700', textShadow: '0 0 10px #FFD700'}}>
                        💰 {user ? user.coins : 0} Moedas
                    </h3>
                </div>
            </div>

            {/* SESSÃO DE NAVES */}
            <h3 style={{borderLeft: '5px solid #8a2be2', paddingLeft: '10px', marginTop: '30px'}}>🚀 Naves</h3>
            <div className="grid-container">
                {naves.map((nave) => (
                    <div key={nave.id} className="game-card">
                         <img 
                            src={`http://localhost:3000/imagens/${nave.sprite}`} 
                            alt={nave.name} 
                            className="card-img"
                        />
                        <h3 className="card-title">{nave.name}</h3>
                        <div className="card-details">
                            <p>Vida: {nave.masLife}</p>
                        </div>
                        {renderCardAction(nave, 'nave')}
                    </div>
                ))}
            </div>

            {/* SESSÃO DE SHOTS */}
            <h3 style={{borderLeft: '5px solid #00d2ff', paddingLeft: '10px', marginTop: '50px'}}>🔫 Armas (Shots)</h3>
            <div className="grid-container">
                {shots.map((shot) => (
                    <div key={shot.id} className="game-card">
                         <img 
                            src={`http://localhost:3000/imagens/${shot.sprite}`} 
                            alt={shot.name} 
                            className="card-img"
                        />
                        <h3 className="card-title">{shot.name}</h3>
                        <div className="card-details">
                            <p>Dano: {shot.damage}</p>
                        </div>
                        {renderCardAction(shot, 'shot')}
                    </div>
                ))}
            </div>

            <div style={{marginTop: '50px', textAlign: 'center'}}>
                <Link to="/" className="nav-link">Voltar ao Menu Principal</Link>
            </div>
        </div>
    );
};

export default Shop;