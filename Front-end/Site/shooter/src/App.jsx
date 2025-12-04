import React, { useState, useEffect } from 'react';
// 1. ADICIONE O 'Navigate' AQUI NOS IMPORTS ⬇️
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import CreateNave from './pages/CreateNave';
import NaveList from './pages/NaveList';
import EditNave from './pages/EditNave';
import GameView from './components/GameView';
import './App.css';

import ShotList from './pages/ShotList';
import CreateShot from './pages/CreateShot';
import EditShot from './pages/EditShot';

import AtributoList from './pages/AtributoList';
import CreateAtributo from './pages/CreateAtributo';
import EditAtributo from './pages/EditAtributo';

import EnemieList from './pages/EnemieList';
import CreateEnemie from './pages/CreateEnemie';
import EditEnemie from './pages/EditEnemie';

import PowerUpList from './pages/PowerUpList';
import CreatePowerUp from './pages/CreatePowerUp';
import EditPowerUp from './pages/EditPowerUp';

import UserList from './pages/UserList';
import EditUser from './pages/EditUser';
import RankingList from './pages/RankingList';
import Shop from './pages/Shop';

const Home = () => (
  <div style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>
    <h1>Bem-vindo ao Painel do NavaShooter</h1>
    <p>Selecione uma opção no menu lateral.</p>
  </div>
);

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate(); 

  const [userData, setUserData] = useState({ 
    nickname: 'Visitante', 
    coins: 0,
    _id: null
  });

  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
      } catch (error) {
        console.error("Erro ao ler dados do usuário", error);
      }
    } else {
      setUserData({ nickname: 'Visitante', coins: 0 });
    }
  }, [location]);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserData({ nickname: 'Visitante', coins: 0 });
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'nav-item active' : 'nav-item';
  };
  
  return (
    <div className={isAuthPage ? "" : "app-layout"}>
      
      {!isAuthPage && (
        <aside className="sidebar">
          
          <div className="profile-section">
            <div className="avatar-circle"></div>
            <div className="profile-info">
              <h3 style={{textTransform: 'capitalize'}}>{userData.nickname}</h3>
              <span>🪙 {userData.coins || 0} | ✎ Editar</span>
            </div>
          </div>

          <nav className="nav-links">
            {/* 2. MUDEI O LINK DA HOME PARA '/home' ⬇️ */}
            <Link to="/home" className={isActive('/home')}>🏠 Home</Link>
            
            <Link to="/jogar" className={isActive('/jogar')}>🎮 Jogar</Link>
            <Link to="/loja" className={isActive('/loja')}>🛒 Loja</Link>
            <Link to="/ranking" className={isActive('/ranking')}>🏆 Ranking</Link>
          </nav>

          <div className="menu-label">Admin</div>
          
          <nav className="nav-links">
            <Link to="/users" className={isActive('/users')}>👥 Usuários</Link>
            <Link to="/atributos" className={isActive('/atributos')}>⚙️ Atributos</Link>
            <Link to="/naves" className={isActive('/naves')}>🚀 Naves</Link>
            <Link to="/shots" className={isActive('/shots')}>🔫 Shots</Link>
            <Link to="/powerups" className={isActive('/powerups')}>👾 Power Up</Link>
          </nav>

          <div className="sidebar-footer">
            <a href="#" onClick={handleLogout} className="btn-sair">🚪 Sair</a>
            <div style={{marginTop: '10px', fontSize: '12px'}}>
               <Link to="/register" style={{color: '#666', textDecoration: 'none'}}>Criar Conta</Link>
            </div>
          </div>
        </aside>
      )} 

      <main className={isAuthPage ? "" : "main-content"}>
        <Routes>
            {/* 3. MUDANÇA NAS ROTAS: REDIRECIONAMENTO ⬇️ */}
            
            {/* Se entrar na raiz, joga pro Login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* A Home agora mora em '/home' */}
            <Route path="/home" element={<Home />} />

            <Route path="/jogar" element={<GameView />} />
            <Route path="/loja" element={<Shop/>} />
            <Route path="/ranking" element={<RankingList />} />

            <Route path="/naves" element={<NaveList />} />
            <Route path="/create-nave" element={<CreateNave />} />
            <Route path="/edit-nave/:id" element={<EditNave />} />

            <Route path="/shots" element={<ShotList />} />
            <Route path="/create-shot" element={<CreateShot />} />
            <Route path="/edit-shot/:id" element={<EditShot />} />

            <Route path="/atributos" element={<AtributoList />} />
            <Route path="/create-atributo" element={<CreateAtributo />} />
            <Route path="/edit-atributo/:id" element={<EditAtributo />} />

            <Route path="/enemies" element={<EnemieList />} />
            <Route path="/create-enemie" element={<CreateEnemie />} />
            <Route path="/edit-enemie/:id" element={<EditEnemie />} />

            <Route path="/powerups" element={<PowerUpList />} />
            <Route path="/create-powerup" element={<CreatePowerUp />} />
            <Route path="/edit-powerup/:id" element={<EditPowerUp />} />

            <Route path="/users" element={<UserList />} />
            <Route path="/edit-user/:id" element={<EditUser />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;