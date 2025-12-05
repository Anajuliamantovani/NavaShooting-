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
  
  // Estado para guardar os IDs que virão do Banco de Dados
  const [naveIdParaCarregar, setNaveIdParaCarregar] = useState(null);
  const [shotIdParaCarregar, setShotIdParaCarregar] = useState(null); // <--- NOVO ESTADO
  const [loadingData, setLoadingData] = useState(true);

  // 1. BUSCAR DADOS DA BAG ANTES DE TUDO
  useEffect(() => {
    const fetchBagData = async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            console.warn("Sem token, usaremos nave e tiro padrão.");
            setNaveIdParaCarregar(1); 
            setShotIdParaCarregar(1); // <--- Default Tiro
            setLoadingData(false);
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const userId = decoded.id;

            const response = await axios.get(`http://localhost:3000/bags/user/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const bags = response.data.bags;

            // Lógica para pegar Nave e Tiro da Bag
            if (bags.length > 0) {
                // Nave
                if (bags[0].naveId) {
                    console.log("Nave equipada:", bags[0].naveId);
                    setNaveIdParaCarregar(bags[0].naveId);
                } else {
                    setNaveIdParaCarregar(1);
                }

                // Tiro (NOVA LÓGICA)
                if (bags[0].shotId) {
                    console.log("Tiro equipado:", bags[0].shotId);
                    setShotIdParaCarregar(bags[0].shotId);
                } else {
                    console.log("Sem tiro na bag, usando padrão (1)");
                    setShotIdParaCarregar(1);
                }

            } else {
                console.log("Bag vazia, usando padrões.");
                setNaveIdParaCarregar(1); 
                setShotIdParaCarregar(1); // <--- Default
            }

        } catch (error) {
            console.error("Erro ao buscar bag:", error);
            setNaveIdParaCarregar(1); 
            setShotIdParaCarregar(1); // <--- Default em caso de erro
        } finally {
            setLoadingData(false);
        }
    };

    fetchBagData();
  }, []);

  // 2. ENVIAR PARA UNITY
  const sendAuthToUnity = useCallback(() => {
    const token = localStorage.getItem('token');
    
    // VERIFICAÇÃO: Só envia se tivermos Token, Unity carregada, e AMBOS os IDs definidos
    if (token && isLoaded && !sentAuth && naveIdParaCarregar !== null && shotIdParaCarregar !== null) {
      
      const payload = {
        token: token,
        naveId: naveIdParaCarregar,
        shotId: shotIdParaCarregar // <--- ENVIANDO O ID DO TIRO AGORA
      };

      console.log("React -> Unity: Enviando Loadout Completo...", payload);

      sendMessage("PlayerNave", "ReceberDadosDoReact", JSON.stringify(payload));
      
      setSentAuth(true);
    }
  }, [isLoaded, sentAuth, sendMessage, naveIdParaCarregar, shotIdParaCarregar]); // <--- Dependência atualizada

  // Monitora carregamento
  useEffect(() => {
    // Só tenta enviar se ambos os IDs não forem nulos
    if (isLoaded && !sentAuth && naveIdParaCarregar !== null && shotIdParaCarregar !== null) {
      const timer = setTimeout(() => {
        sendAuthToUnity();
      }, 1000); 
      return () => clearTimeout(timer);
    }
  }, [isLoaded, sentAuth, naveIdParaCarregar, shotIdParaCarregar, sendAuthToUnity]);

  // Estilos
  const wrapperStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    minHeight: "80vh" 
  };

  return (
    <div style={wrapperStyle} className="page-container">
      <h2 style={{ marginBottom: "15px" }}>NavaShooter Web</h2>
      
      {(!isLoaded || loadingData) && (
        <div style={{ color: "#bf55ec", marginBottom: "10px", fontWeight: "bold" }}>
           {loadingData ? "Carregando Inventário..." : `Carregando Engine... ${Math.round(loadingProgression * 100)}%`}
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
          display: (isLoaded && !loadingData) ? "block" : "none" 
      }}>
          <Unity 
            unityProvider={unityProvider} 
            style={{ width: "100%", height: "100%" }} 
          />
      </div>
      
      <p style={{ color: "#888", marginTop: "15px", fontSize: "0.9rem" }}>
        Status: {sentAuth ? `JOGO INICIADO (Nave: ${naveIdParaCarregar}, Tiro: ${shotIdParaCarregar})` : "Aguardando..."}
      </p>
    </div>
  );
}

export default GameView;