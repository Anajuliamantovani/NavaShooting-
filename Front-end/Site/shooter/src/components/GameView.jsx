import React, { useEffect, useState, useCallback } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

function GameView() {
  // Configuração do Unity
  const { unityProvider, loadingProgression, isLoaded, sendMessage } = useUnityContext({
    loaderUrl: "Build/NavaShooter.loader.js",
    dataUrl: "Build/NavaShooter.data.br",
    frameworkUrl: "Build/NavaShooter.framework.js.br",
    codeUrl: "Build/NavaShooter.wasm.br",
  });

  const [sentAuth, setSentAuth] = useState(false);
  
  // Estado para guardar o ID da nave que virá do Banco de Dados
  // Começa como null para sabermos que ainda está carregando
  const [naveIdParaCarregar, setNaveIdParaCarregar] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  // 1. BUSCAR DADOS DA BAG ANTES DE TUDO
  useEffect(() => {
    const fetchBagData = async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            console.warn("Sem token, usaremos nave padrão.");
            setNaveIdParaCarregar(1); // Nave padrão se não estiver logado
            setLoadingData(false);
            return;
        }

        try {
            // Decodifica o token para pegar o ID do usuário
            const decoded = jwtDecode(token);
            const userId = decoded.id;

            // Busca a Bag do usuário
            const response = await axios.get(`http://localhost:3000/bags/user/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const bags = response.data.bags;

            // Se tiver bag e tiver nave equipada, usa ela. Senão, usa a 1.
            if (bags.length > 0 && bags[0].naveId) {
                console.log("Nave equipada encontrada:", bags[0].naveId);
                setNaveIdParaCarregar(bags[0].naveId);
            } else {
                console.log("Nenhuma nave equipada, usando padrão (1)");
                setNaveIdParaCarregar(1); 
            }

        } catch (error) {
            console.error("Erro ao buscar bag:", error);
            setNaveIdParaCarregar(1); // Fallback em caso de erro
        } finally {
            setLoadingData(false);
        }
    };

    fetchBagData();
  }, []);

  // 2. ENVIAR PARA UNITY (Só roda quando tivermos o ID e a Unity estiver pronta)
  const sendAuthToUnity = useCallback(() => {
    const token = localStorage.getItem('token');
    
    // Verificação extra: naveIdParaCarregar não pode ser null
    if (token && isLoaded && !sentAuth && naveIdParaCarregar !== null) {
      
      const payload = {
        token: token,
        naveId: naveIdParaCarregar // Agora é dinâmico!
      };

      console.log("React -> Unity: Enviando Loadout...", payload);

      sendMessage("PlayerNave", "ReceberDadosDoReact", JSON.stringify(payload));
      
      setSentAuth(true);
    }
  }, [isLoaded, sentAuth, sendMessage, naveIdParaCarregar]);

  // Monitora o carregamento da Unity E o carregamento dos dados da API
  useEffect(() => {
    if (isLoaded && !sentAuth && naveIdParaCarregar !== null) {
      // Pequeno delay de segurança
      const timer = setTimeout(() => {
        sendAuthToUnity();
      }, 1000); 
      return () => clearTimeout(timer);
    }
  }, [isLoaded, sentAuth, naveIdParaCarregar, sendAuthToUnity]);

  // Estilos
  const wrapperStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    minHeight: "80vh" // O fundo já vem do body/App.css
  };

  return (
    <div style={wrapperStyle} className="page-container">
      <h2 style={{ marginBottom: "15px" }}>NavaShooter Web</h2>
      
      {/* Feedback de Carregamento */}
      {(!isLoaded || loadingData) && (
        <div style={{ color: "#bf55ec", marginBottom: "10px", fontWeight: "bold" }}>
           {loadingData ? "Buscando sua nave..." : `Carregando Engine... ${Math.round(loadingProgression * 100)}%`}
        </div>
      )}

      <div style={{
          border: "2px solid #8a2be2",
          boxShadow: "0 0 30px rgba(138, 43, 226, 0.4)",
          borderRadius: "8px",
          overflow: "hidden",
          width: "960px",
          height: "600px",
          background: "#000",
          display: (isLoaded && !loadingData) ? "block" : "none" // Esconde até estar tudo pronto
      }}>
          <Unity 
            unityProvider={unityProvider} 
            style={{ width: "100%", height: "100%" }} 
          />
      </div>
      
      <p style={{ color: "#888", marginTop: "15px", fontSize: "0.9rem" }}>
        Status: {sentAuth ? `JOGO INICIADO (Nave ID: ${naveIdParaCarregar})` : "Aguardando..."}
      </p>
    </div>
  );
}

export default GameView;