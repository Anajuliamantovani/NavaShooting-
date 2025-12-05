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
    _id: null,
    profilePic: null // Adicionado para garantir consistência
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
            <div className="avatar-circle" style={{ overflow: 'hidden', position: 'relative' }}>
              {userData.profilePic ? (
                <img
                  src={`http://localhost:3000/imagens/${userData.profilePic}`}
                  alt="Perfil"
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
                <span style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {userData.nickname ? userData.nickname.charAt(0).toUpperCase() : '?'}
                </span>
              )}
            </div>

            <div className="profile-info">
              <h3 style={{ textTransform: 'capitalize' }}>{userData.nickname}</h3>
              {/* Atualizei o link de editar para ir para a página de edição do próprio usuário se tiver ID */}
              <span>
                🪙 {userData.coins || 0}
                <Link to={userData.id || userData._id ? `/edit-user/${userData.id || userData._id}` : '#'} style={{ color: 'inherit', textDecoration: 'none', marginLeft: '5px' }}>
                  ✎ Editar perfil
                </Link>
              </span>
            </div>
          </div>

          <nav className="nav-links">
            <Link to="/home" className={isActive('/home')}>🏠 Home</Link>

            <Link to="/jogar" className={isActive('/jogar')}>🎮 Jogar</Link>
            <Link to="/loja" className={isActive('/loja')}>🛒 Loja</Link>
            <Link to="/ranking" className={isActive('/ranking')}>🏆 Ranking</Link>
          </nav>

          <div className="menu-label">Admin</div>

          <nav className="nav-links">
            <Link to="/users" className={isActive('/users')}>👥 JOGADORES</Link>
            <Link to="/atributos" className={isActive('/atributos')}>⚙️ Atributos</Link>
            <Link to="/naves" className={isActive('/naves')}>🚀 Naves</Link>
            <Link to="/shots" className={isActive('/shots')}>🔫 Shots</Link>
            <Link to="/powerups" className={isActive('/powerups')}>👾 Power Up</Link>
          </nav>

           <div className="sidebar-footer">
            
            {/* AQUI ESTÁ A CORREÇÃO:
               Adicionei uma div PAI com display: 'flex' para segurar os dois botões lado a lado.
            */}
            <div style={{ display: 'flex', gap: '10px', width: '100%', marginBottom: '10px' }}>
                
                {/* 1. Botão GitHub */}
                <a 
                href="https://github.com/Anajuliamantovani/NavaShooting-" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                    flex: 1, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '5px',
                    textDecoration: 'none',
                    color: 'white', 
                    padding: '10px 5px', 
                    borderRadius: '5px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                }}
                >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Github
                </a>

                {/* 2. Botão Sair */}
                <a 
                    href="#" 
                    onClick={handleLogout} 
                    className="btn-sair" 
                    style={{
                        flex: 1, 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        gap: '5px',
                        color: 'white', 
                        margin: 0,
                        padding: '10px 5px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textDecoration: 'none'
                    }}
                >
                    Sair
                </a>
            </div>
          </div>
        </aside>
      )}

      <main className={isAuthPage ? "" : "main-content"}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/home" element={<Home />} />

          <Route path="/jogar" element={<GameView />} />
          <Route path="/loja" element={<Shop />} />
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