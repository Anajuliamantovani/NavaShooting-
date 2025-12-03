import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

// Seus imports (Login, Register, etc...) continuam aqui
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

const Home = () => (
  <div style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>
    <h1>Bem-vindo ao Painel do NavaShooter</h1>
    <p>Selecione uma opção no menu lateral.</p>
  </div>
);

const AppContent = () => {
  const location = useLocation(); 

  // Verifica se a rota atual é Login ou Register
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  const isActive = (path) => {
    return location.pathname === path ? 'nav-item active' : 'nav-item';
  };
  
  return (
    // 1. CORREÇÃO: Se for Login, remove a classe 'app-layout' para não criar o espaço da sidebar
    <div className={isAuthPage ? "" : "app-layout"}>
      
      {/* 2. CORREÇÃO: Adicionamos esta lógica "{!isAuthPage && ...}" */}
      {/* Isso significa: "Se NÃO for página de autenticação, mostre o aside" */}
      {!isAuthPage && (
        <aside className="sidebar">
          
          <div className="profile-section">
            <div className="avatar-circle"></div>
            <div className="profile-info">
              <h3>Jurubebinha</h3>
              <span>🪙 000 | ✎ Editar</span>
            </div>
          </div>

          <nav className="nav-links">
            <Link to="/" className={isActive('/')}>
              🏠 Home
            </Link>
            <Link to="/jogar" className={isActive('/jogar')}>
              🎮 Jogar
            </Link>
            <Link to="/powerups" className={isActive('/powerups')}>
              🛒 Loja
            </Link>
            <Link to="/ranking" className={isActive('/ranking')}>
              🏆 Ranking
            </Link>
          </nav>

          <div className="menu-label">Admin</div>
          
          <nav className="nav-links">
            <Link to="/users" className={isActive('/users')}>
              👥 Usuários
            </Link>
            <Link to="/atributos" className={isActive('/atributos')}>
              ⚙️ Atributos
            </Link>
            <Link to="/naves" className={isActive('/naves')}>
              🚀 Naves
            </Link>
            <Link to="/shots" className={isActive('/shots')}>
              🔫 Shots
            </Link>
            <Link to="/powerups" className={isActive('/powerups')}>
              👾 Power Up
            </Link>
            <Link to="/enemies" className={isActive('/enemies')}>
              👾 Inimigos
            </Link>
          </nav>

          <div className="sidebar-footer">
            <Link to="/login" className="btn-sair">
              🚪 Sair
            </Link>
            <div style={{marginTop: '10px', fontSize: '12px'}}>
               <Link to="/register" style={{color: '#666', textDecoration: 'none'}}>Criar Conta</Link>
            </div>
          </div>
        </aside>
      )} 
      {/* Fim da lógica do menu */}

      {/* 3. CORREÇÃO: Remove a classe 'main-content' no login para tirar o padding extra */}
      <main className={isAuthPage ? "" : "main-content"}>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jogar" element={<GameView />} />

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
            <Route path="/ranking" element={<RankingList />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;