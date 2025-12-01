import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Importando os componentes e páginas
import Login from './pages/Login';
import Register from './pages/Register';
import CreateNave from './pages/CreateNave';
import NaveList from './pages/NaveList'; // <--- NOVO IMPORT
import EditNave from './pages/EditNave'; // <--- NOVO IMPORT
import GameView from './components/GameView';
import './App.css'

// === NOVOS IMPORTS ===
import ShotList from './pages/ShotList';
import CreateShot from './pages/CreateShot';
import EditShot from './pages/EditShot';


import AtributoList from './pages/AtributoList';
import CreateAtributo from './pages/CreateAtributo';
import EditAtributo from './pages/EditAtributo';

// ... imports anteriores
import EnemieList from './pages/EnemieList';
import CreateEnemie from './pages/CreateEnemie';
import EditEnemie from './pages/EditEnemie';


const Home = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h1>Bem-vindo ao Painel do NavaShooter</h1>
    <p>Escolha uma opção no menu acima.</p>
  </div>
);

function App() {
  const navStyle = {
    backgroundColor: '#20232a',
    padding: '15px',
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
  };

  const linkStyle = {
    color: '#61dafb',
    textDecoration: 'none',
    fontSize: '18px',
    fontWeight: 'bold'
  };

  return (
    <Router>
      <div className="App">
        {/* MENU DE NAVEGAÇÃO */}
        <nav style={navStyle}>
          <Link to="/" style={linkStyle}>🏠 Home</Link>
          <Link to="/jogar" style={linkStyle}>🎮 Jogar Agora</Link>
          {/* Mudei o link de criar direto para a lista, faz mais sentido no fluxo */}
          <Link to="/naves" style={linkStyle}>🚀 Gerenciar Naves</Link>
          <Link to="/shots" style={linkStyle}>🔫 Shots</Link> {/* NOVO LINK */} 
          <Link to="/atributos" style={linkStyle}>⚙️ Atributos</Link> {/* NOVO LINK */}
          <Link to="/enemies" style={linkStyle}>👾 Inimigos</Link> {/* NOVO LINK */}
          <span style={{ color: '#444' }}>|</span>
          <Link to="/login" style={linkStyle}>Login</Link>
          <Link to="/register" style={linkStyle}>Cadastro</Link>
        </nav>

        {/* DEFINIÇÃO DAS ROTAS */}
        <div style={{ padding: '20px' }}>
            <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Rota do Jogo */}
            <Route path="/jogar" element={<GameView />} />

            {/* Rotas de Admin/Sistema */}
            <Route path="/naves" element={<NaveList />} /> {/* Lista de Cards */}
            <Route path="/create-nave" element={<CreateNave />} />
            <Route path="/edit-nave/:id" element={<EditNave />} /> {/* Rota dinâmica com ID */}

            {/* === ROTAS DE SHOTS === */}
            <Route path="/shots" element={<ShotList />} />
            <Route path="/create-shot" element={<CreateShot />} />
            <Route path="/edit-shot/:id" element={<EditShot />} />

            {/* ROTAS DE ATRIBUTOS */}
            <Route path="/atributos" element={<AtributoList />} />
            <Route path="/create-atributo" element={<CreateAtributo />} />
            <Route path="/edit-atributo/:id" element={<EditAtributo />} />

            {/* ROTAS DE INIMIGOS */}
            <Route path="/enemies" element={<EnemieList />} />
            <Route path="/create-enemie" element={<CreateEnemie />} />
            <Route path="/edit-enemie/:id" element={<EditEnemie />} />
            
            {/* Rotas de Autenticação */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;