using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

public class gerenciarPowerUops : MonoBehaviour
{
    [Header("Configurações de Spawn")]
    public Transform pontoA, pontoB;
    bool spawn = true;
    public GameObject prafabPowerUp;
    public GameObject prafabMeteor;
    float aleatorio;
    public float tempoSpawnPowerUp = 5f;
    public float tempoSpawnMeteor = 3f;
    public int vidameteor;

    [Header("API e Dados")]
    public string Token; // Será preenchido externamente
    private string apiBaseUrl = "http://localhost:3000";

    // Lista para armazenar os dados JSON (cache)
    private List<PowerUpData> listaPowerUpsDisponiveis = new List<PowerUpData>();
    private bool listaCarregada = false;

    // --- CLASSES PARA MAPEAR O JSON (Baseado na sua API) ---
    [System.Serializable]
    public class PowerUpListResponse
    {
        public string mensagem;
        public PowerUpData[] powerUps;
    }

    [System.Serializable]
    public class PowerUpData
    {
        public int id;
        public string name;
        public string sprite;
        public string status;
        public ShotData shot;       // Chave Estrangeira (Objeto aninhado)
        public AtributoData atributo; // Chave Estrangeira (Objeto aninhado)
    }

    [System.Serializable]
    public class ShotData
    {
        public int id;
        public string name;
        public int damage;
    }

    [System.Serializable]
    public class AtributoData
    {
        public int id;
        public float speed;
        public float scale;
        public bool shield;
    }

    void Start()
    {
        // Inicia as rotinas principais
        StartCoroutine(InicializarGerenciador());
    }

    // Rotina para garantir que temos o Token antes de tentar baixar a lista
    IEnumerator InicializarGerenciador()
    {
        // Espera até que o Token seja preenchido (pelo script da Nave)
        while (string.IsNullOrEmpty(Token))
        {
            yield return new WaitForSeconds(0.5f);
        }

        // 1. Baixa a lista de todos os PowerUps disponíveis
        yield return StartCoroutine(BaixarListaPowerUps());

        // 2. Só inicia o spawn se tivermos itens na lista
        if (listaCarregada && listaPowerUpsDisponiveis.Count > 0)
        {
            StartCoroutine(loopPowerUp());
            StartCoroutine(loopMeteor());
        }
        else
        {
            Debug.LogError("Não foi possível iniciar o spawn: Lista de PowerUps vazia ou erro na API.");
        }
    }

    IEnumerator BaixarListaPowerUps()
    {
        string url = apiBaseUrl + "/powerups/allPowerUps";

        using (UnityWebRequest request = UnityWebRequest.Get(url))
        {
            request.SetRequestHeader("Authorization", "Bearer " + Token);
            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                string json = request.downloadHandler.text;
                PowerUpListResponse resposta = JsonUtility.FromJson<PowerUpListResponse>(json);

                // Filtra apenas os ativos ('A') se necessário, ou pega todos
                listaPowerUpsDisponiveis.Clear();
                foreach (var pu in resposta.powerUps)
                {
                    if (pu.status == "A") listaPowerUpsDisponiveis.Add(pu);
                }

                listaCarregada = true;
                Debug.Log($"Lista carregada com {listaPowerUpsDisponiveis.Count} PowerUps.");
            }
            else
            {
                Debug.LogError("Erro ao baixar lista de PowerUps: " + request.error);
            }
        }
    }

    IEnumerator loopPowerUp()
    {
        while (spawn)
        {
            // 1. Sorteia uma posição X
            aleatorio = Random.Range(pontoA.transform.position.x, pontoB.transform.position.x);
            Vector3 pos = new Vector3(aleatorio, pontoA.transform.position.y, pontoA.transform.position.z);

            // 2. Escolhe um PowerUp aleatório da lista baixada
            if (listaPowerUpsDisponiveis.Count > 0)
            {
                int indexAleatorio = Random.Range(0, listaPowerUpsDisponiveis.Count);
                PowerUpData dadosSorteados = listaPowerUpsDisponiveis[indexAleatorio];

                // 3. Instancia o Prefab
                GameObject novoPowerUp = Instantiate(prafabPowerUp, pos, transform.rotation);

                // 4. Inicia o download da imagem E aplica os dados neste objeto específico
                StartCoroutine(ConfigurarPowerUpInstanciado(novoPowerUp, dadosSorteados));
            }

            yield return new WaitForSeconds(tempoSpawnPowerUp);
        }
    }

    // Esta rotina baixa a imagem e injeta os dados no objeto spawnado
    IEnumerator ConfigurarPowerUpInstanciado(GameObject objPowerUp, PowerUpData dados)
    {
        // --- A. Baixar a Imagem (Sprite) ---
        if (!string.IsNullOrEmpty(dados.sprite))
        {
            string urlImagem = apiBaseUrl + "/imagens/" + dados.sprite;

            using (UnityWebRequest request = UnityWebRequestTexture.GetTexture(urlImagem))
            {
                yield return request.SendWebRequest();

                if (request.result == UnityWebRequest.Result.Success && objPowerUp != null)
                {
                    Texture2D textura = DownloadHandlerTexture.GetContent(request);

                    // Cria o Sprite
                    Sprite sprite = Sprite.Create(textura,
                        new Rect(0, 0, textura.width, textura.height),
                        new Vector2(0.5f, 0.5f), 100f);

                    // Aplica no SpriteRenderer do objeto instanciado
                    SpriteRenderer sr = objPowerUp.GetComponent<SpriteRenderer>();
                    if (sr != null) sr.sprite = sprite;
                }
            }
        }

        // --- B. Aplicar Lógica (Shot ou Atributo) ---
        // Verificamos se o objeto ainda existe (pode ter sido destruído pelo jogador antes do download acabar)
        if (objPowerUp != null)
        {
            // Vamos supor que seu prefab tem um script chamado "Coletavel" ou "PowerUpBehavior"
            // Você deve adaptar isso para o nome real do seu script no prefab

            // Exemplo Genérico:
            // var script = objPowerUp.GetComponent<SeuScriptDePowerUp>();
            // if(script != null) {
            //     script.nome = dados.name;
            //     if(dados.shot != null) script.idTiro = dados.shot.id;
            //     if(dados.atributo != null) script.velocidadeExtra = dados.atributo.speed;
            // }

            // Debug para confirmar que pegamos os dados aninhados
            if (dados.shot != null)
                Debug.Log($"Spawnou PowerUp de Arma: {dados.shot.name} (Dano: {dados.shot.damage})");
            else if (dados.atributo != null)
                Debug.Log($"Spawnou PowerUp de Atributo (Speed: {dados.atributo.speed})");
        }
    }

    IEnumerator loopMeteor()
    {
        while (spawn)
        {
            aleatorio = Random.Range(pontoA.transform.position.x, pontoB.transform.position.x);
            var meterioto = Instantiate(prafabMeteor, new Vector3(aleatorio, pontoA.transform.position.y, pontoA.transform.position.z), transform.rotation);

            // Lógica original mantida, apenas corrigindo o acesso ao componente se necessário
            // Supondo que "powerUps" seja o nome do script do meteoro (nome confuso, mas mantive o original)
            var scriptMeteoro = meterioto.GetComponent<powerUps>();
            if (scriptMeteoro != null)
            {
                scriptMeteoro.vidaMeteur = vidameteor;
                vidameteor++; // Incrementa para o próximo
            }

            if (tempoSpawnMeteor > 0.5f)
            {
                tempoSpawnMeteor = tempoSpawnMeteor - 0.001f;
            }
            yield return new WaitForSeconds(tempoSpawnMeteor);
        }
    }
}