import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Importando os componentes e páginas
import Login from './pages/Login';
import Register from './pages/Register';
import CreateNave from './pages/CreateNave';
import GameView from './components/GameView'; // Importando o Jogo
import './App.css'

// Componente simples para a Home
const Home = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h1>Bem-vindo ao Painel do NavaShooter</h1>
    <p>Escolha uma opção no menu acima.</p>
  </div>
);

function App() {
  // Estilos simples para o menu
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
          <Link to="/create-nave" style={linkStyle}>🛠️ Admin: Criar Nave</Link>
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
            <Route path="/create-nave" element={<CreateNave />} />
            
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