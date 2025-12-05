using System.Collections;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;
using static UnityEditor.PlayerSettings;

public class NaveLoader : MonoBehaviour
{
    [Header("Configurações da API")]
    private string apiBaseUrl = "http://localhost:3000";

    [Header("Configurações de Tamanho")]
    [Tooltip("Tamanho final da nave em unidades da Unity")]
    public float tamanhoDesejadoNave = 1.5f;
    [Tooltip("Tamanho final do tiro em unidades da Unity")]
    public float tamanhoDesejadoTiro = 0.5f; // Tiros geralmente são menores

    [Header("Dados para Teste (Editor)")]
    public string tokemP;
    public int idSprit; // ID da Nave
    public int idShot;  // ID do Tiro (NOVO)

    [Header("Componentes Visuais")]
    public Image image; // Onde a nave será exibida

    [Header("Assets Carregados")]
    public Sprite tiro; // AQUI ficará o sprite do tiro carregado

    private void Start()
    {
        // Se tiver token preenchido no Inspector, carrega os dados (Modo Teste)
        if (!string.IsNullOrEmpty(tokemP))
        {
            StartCoroutine(CarregarNaveDaAPI(tokemP, idSprit));
            StartCoroutine(CarregarShotDaAPI(tokemP, idShot));
            ups.Token = tokemP;
        }
    }

    // --- Estruturas de Dados para o JSON ---

    // 1. Classes para Nave
    [System.Serializable]
    public class NaveResponse
    {
        public string mensagem;
        public NaveData nave;
    }

    [System.Serializable]
    public class NaveData
    {
        public int id;
        public string name;
        public string sprite;
        public int masLife;
        public string status;
        public int price;
    }

    // 2. Classes para Shot (NOVO)
    [System.Serializable]
    public class ShotResponse
    {
        public string mensagem;
        public ShotData shot;
    }

    [System.Serializable]
    public class ShotData
    {
        public int id;
        public string name;
        public string sprite;
        public int damage;
        public int price;
    }

    // 3. Payload recebido do React (ATUALIZADO)
    [System.Serializable]
    public class ReactPayload
    {
        public string token;
        public int naveId;
        public int shotId; // Agora recebemos o ID do tiro também
    }

    public gerenciarPowerUops ups;

    // --- Método Chamado pelo React ---
    public void ReceberDadosDoReact(string jsonPayload)
    {
        Debug.Log("Unity: Recebi dados do React: " + jsonPayload);

        ReactPayload dados = JsonUtility.FromJson<ReactPayload>(jsonPayload);

        ups.Token = dados.token;

        if (dados != null && !string.IsNullOrEmpty(dados.token))
        {
            // Inicia o carregamento da Nave
            StartCoroutine(CarregarNaveDaAPI(dados.token, dados.naveId));

            // Inicia o carregamento do Tiro (se vier um ID válido)
            if (dados.shotId > 0)
            {
                StartCoroutine(CarregarShotDaAPI(dados.token, dados.shotId));
            }
        }
        else
        {
            Debug.LogError("Unity: Token ou IDs inválidos recebidos.");
        }
    }

    // --- Coroutines NAVE ---

    IEnumerator CarregarNaveDaAPI(string token, int id)
    {
        string url = apiBaseUrl + "/naves/" + id + "/nave";

        using (UnityWebRequest request = UnityWebRequest.Get(url))
        {
            request.SetRequestHeader("Authorization", "Bearer " + token);
            yield return request.SendWebRequest();

            if (request.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError("Erro API Nave: " + request.error);
            }
            else
            {
                string jsonResult = request.downloadHandler.text;
                NaveResponse resposta = JsonUtility.FromJson<NaveResponse>(jsonResult);

                Debug.Log("Nave carregada: " + resposta.nave.name);

                if (!string.IsNullOrEmpty(resposta.nave.sprite))
                {
                    StartCoroutine(BaixarSpriteNave(resposta.nave.sprite));
                }
            }
        }
    }

    IEnumerator BaixarSpriteNave(string nomeArquivo)
    {
        string urlImagem = apiBaseUrl + "/imagens/" + nomeArquivo;

        using (UnityWebRequest request = UnityWebRequestTexture.GetTexture(urlImagem))
        {
            yield return request.SendWebRequest();

            if (request.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError("Erro Imagem Nave: " + request.error);
            }
            else
            {
                Texture2D textura = DownloadHandlerTexture.GetContent(request);
                float maiorLado = Mathf.Max(textura.width, textura.height);
                float ppu = maiorLado / tamanhoDesejadoNave;

                Sprite novoSprite = Sprite.Create(
                    textura,
                    new Rect(0, 0, textura.width, textura.height),
                    new Vector2(0.5f, 0.5f),
                    ppu
                );

                image.sprite = novoSprite; // Aplica na Nave
            }
        }
    }

    // --- Coroutines TIRO (NOVAS) ---

    IEnumerator CarregarShotDaAPI(string token, int id)
    {
        // Rota da API de tiros
        string url = apiBaseUrl + "/shots/" + id + "/shot";

        using (UnityWebRequest request = UnityWebRequest.Get(url))
        {
            request.SetRequestHeader("Authorization", "Bearer " + token);
            yield return request.SendWebRequest();

            if (request.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError("Erro API Shot: " + request.error);
            }
            else
            {
                string jsonResult = request.downloadHandler.text;
                ShotResponse resposta = JsonUtility.FromJson<ShotResponse>(jsonResult);

                Debug.Log("Shot carregado: " + resposta.shot.name);

                if (!string.IsNullOrEmpty(resposta.shot.sprite))
                {
                    StartCoroutine(BaixarSpriteTiro(resposta.shot.sprite));
                    this.gameObject.GetComponent<Player>().shotImpot = resposta.shot;
                }
            }
        }
    }

    IEnumerator BaixarSpriteTiro(string nomeArquivo)
    {
        string urlImagem = apiBaseUrl + "/imagens/" + nomeArquivo;

        using (UnityWebRequest request = UnityWebRequestTexture.GetTexture(urlImagem))
        {
            yield return request.SendWebRequest();

            if (request.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError("Erro Imagem Shot: " + request.error);
            }
            else
            {
                Texture2D textura = DownloadHandlerTexture.GetContent(request);

                // Calcula PPU para o tiro (geralmente menor que a nave)
                float maiorLado = Mathf.Max(textura.width, textura.height);
                float ppu = maiorLado / tamanhoDesejadoTiro;

                Sprite novoSprite = Sprite.Create(
                    textura,
                    new Rect(0, 0, textura.width, textura.height),
                    new Vector2(0.5f, 0.5f), // Pivô no centro
                    ppu
                );

                // SALVA NA VARIÁVEL PÚBLICA COMO PEDIDO
                tiro = novoSprite;
                this.gameObject.GetComponent<Player>().tiros = tiro;
                

                //Debug.Log("Sprite do tiro salvo na variável 'tiro' com sucesso!");
            }
        }
    }
}