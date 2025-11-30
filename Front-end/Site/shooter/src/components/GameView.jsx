import React, { useEffect, useState, useCallback } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function GameView() {
  // Configuração do Unity Context
  // ATENÇÃO: Verifique se os nomes dos arquivos na pasta public/Build batem exatamente com estes.
  // Assumindo que você desativou a compressão na Unity, removemos o .br ou .gz do final.
  const { unityProvider, loadingProgression, isLoaded, sendMessage } = useUnityContext({
    loaderUrl: "Build/NavaShooter.loader.js",
    dataUrl: "Build/NavaShooter.data.br",
    frameworkUrl: "Build/NavaShooter.framework.js.br",
    codeUrl: "Build/NavaShooter.wasm.br",
  });

  // Estado para garantir que enviamos o token apenas uma vez
  const [sentAuth, setSentAuth] = useState(false);

  // ID da nave que queremos carregar. 
  // Num cenário real, isso poderia vir da URL (ex: useParams) ou de um estado global.
  // Por enquanto, deixamos fixo em 1 para teste.
  const naveIdParaCarregar = 1; 

  // Função que envia o Token e o ID para dentro do jogo
  const sendAuthToUnity = useCallback(() => {
    // Recupera o token salvo no Login
    const token = localStorage.getItem('token');
    
    // Só envia se: temos token, o jogo carregou e ainda não enviamos
    if (token && isLoaded && !sentAuth) {
      
      // Criamos o objeto JSON igual ao que definimos na classe ReactPayload do C#
      const payload = {
        token: token,
        naveId: naveIdParaCarregar
      };

      console.log("React: Enviando dados para Unity...", payload);

      // 1. "PlayerNave" = Nome do GameObject na cena Unity (que tem o script NaveLoader)
      // 2. "ReceberDadosDoReact" = Nome da função pública no script C#
      // 3. JSON.stringify(payload) = O argumento string esperado pelo C#
      sendMessage("PlayerNave", "ReceberDadosDoReact", JSON.stringify(payload));
      
      setSentAuth(true);
    } else if (!token) {
      console.warn("React: Nenhum token encontrado. O usuário fez login?");
    }
  }, [isLoaded, sentAuth, sendMessage]);

  // UseEffect monitora o carregamento. Assim que isLoaded virar true, dispara o envio.
  useEffect(() => {
    if (isLoaded && !sentAuth) {
      // Um pequeno delay de 1s é recomendável para garantir que todos os scripts da cena Unity inicializaram
      const timer = setTimeout(() => {
        sendAuthToUnity();
      }, 1000); 
      return () => clearTimeout(timer);
    }
  }, [isLoaded, sentAuth, sendAuthToUnity]);

  // Estilos para centralizar e deixar visualmente agradável
  const wrapperStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "#1a1a1a",
    minHeight: "80vh" // Ocupa boa parte da tela
  };

  return (
    <div style={wrapperStyle}>
      <h2 style={{ color: "white", marginBottom: "15px" }}>NavaShooter Web</h2>
      
      {/* Barra de Carregamento */}
      {!isLoaded && (
        <div style={{ color: "white", marginBottom: "10px" }}>
          Carregando recursos... {Math.round(loadingProgression * 100)}%
        </div>
      )}

      {/* O Jogo Unity */}
      <Unity 
        unityProvider={unityProvider} 
        style={{ 
          width: "960px", 
          height: "600px", 
          border: "2px solid #555",
          boxShadow: "0 0 20px rgba(0,0,0,0.5)",
          visibility: isLoaded ? "visible" : "hidden" // Evita mostrar tela branca antes da hora
        }} 
      />
      
      <p style={{ color: "#888", marginTop: "15px", fontSize: "0.9rem" }}>
        Status: {isLoaded ? "Jogo Rodando" : "Inicializando..."} | 
        Token Enviado: {sentAuth ? "Sim" : "Não"}
      </p>
    </div>
  );
}

export default GameView;