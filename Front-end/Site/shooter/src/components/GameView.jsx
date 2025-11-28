import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function GameView() {
  // Configura o hook com os caminhos dos arquivos que você colocou na pasta public
  const { unityProvider } = useUnityContext({
    loaderUrl: "Build/NavaShooter.loader.js",
    dataUrl: "Build/NavaShooter.data.br",
    frameworkUrl: "Build/NavaShooter.framework.js.br",
    codeUrl: "Build/NavaShooter.wasm.br",
  });

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      {/* O componente Unity renderiza o Canvas do jogo */}
      <Unity 
        unityProvider={unityProvider} 
        style={{ width: "800px", height: "600px", border: "2px solid black" }} 
      />
    </div>
  );
}

export default GameView;