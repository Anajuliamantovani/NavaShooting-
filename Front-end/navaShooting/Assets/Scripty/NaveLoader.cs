using System.Collections;
using UnityEngine;
using UnityEngine.Networking;
using TMPro;
//using UnityEditor.Experimental.GraphView;

public class NaveLoader : MonoBehaviour
{
    [Header("Configurações da API")]
    // Ajuste para o seu IP local se necessário, mas localhost costuma funcionar em WebGL local
    private string apiBaseUrl = "http://localhost:3000";

    [Header("Configurações de Tamanho")]
    [Tooltip("Tamanho final da nave em unidades da Unity (ex: 1 ou 2)")]
    public float tamanhoDesejado = 1.5f;

    private SpriteRenderer spriteRenderer;

    public TMP_Text nome;
    public TMP_Text preco;
    public TMP_Text vida;

    void Awake()
    {
        spriteRenderer = GetComponent<SpriteRenderer>();
    }

    // --- Estruturas de Dados para o JSON ---
    // Precisamos dessas classes para o JsonUtility ler a resposta da sua API
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
        public string sprite; // Aqui virá o nome do arquivo (ex: "123456-nave.png")
        public int masLife;
        public string status;
        public int price;
    }

    [System.Serializable]
    public class ReactPayload
    {
        public string token;
        public int naveId;
    }

    // --- Método Chamado pelo React ---
    // O React vai mandar uma string JSON: '{"token":"xyz...", "naveId":1}'
    public void ReceberDadosDoReact(string jsonPayload)
    {
        Debug.Log("Unity: Recebi dados do React!");

        ReactPayload dados = JsonUtility.FromJson<ReactPayload>(jsonPayload);

        if (dados != null && !string.IsNullOrEmpty(dados.token))
        {
            StartCoroutine(CarregarNaveDaAPI(dados.token, dados.naveId));
        }
        else
        {
            Debug.LogError("Unity: Token ou ID inválidos recebidos.");
        }
    }

    // --- Coroutines (Requisições Web) ---

    IEnumerator CarregarNaveDaAPI(string token, int id)
    {
        string url = apiBaseUrl + "/naves/" + id + "/nave";

        using (UnityWebRequest request = UnityWebRequest.Get(url))
        {
            // ADICIONA O TOKEN NO HEADER (Fundamental para passar pelo checkAuth)
            request.SetRequestHeader("Authorization", "Bearer " + token);

            yield return request.SendWebRequest();

            if (request.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError("Erro API Dados: " + request.error);
            }
            else
            {
                string jsonResult = request.downloadHandler.text;
                NaveResponse resposta = JsonUtility.FromJson<NaveResponse>(jsonResult);

                Debug.Log("Nave carregada: " + resposta.nave.name);

                nome.text = resposta.nave.name;
                vida.text = resposta.nave.masLife.ToString();
                preco.text = resposta.nave.price.ToString();

                // Se tiver imagem, inicia o download da textura
                if (!string.IsNullOrEmpty(resposta.nave.sprite))
                {
                    StartCoroutine(BaixarSprite(resposta.nave.sprite));
                }
            }
        }
    }

    IEnumerator BaixarSprite(string nomeArquivo)
    {
        // Monta a URL da imagem estática configurada no seu app.js
        // app.use('/imagens', express.static(...))
        string urlImagem = apiBaseUrl + "/imagens/" + nomeArquivo;

        // UnityWebRequestTexture baixa direto para memórdia otimizada de textura
        using (UnityWebRequest request = UnityWebRequestTexture.GetTexture(urlImagem))
        {
            yield return request.SendWebRequest();

            if (request.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError("Erro API Imagem: " + request.error);
            }
            else
            {
                // Pega a textura da memória
                Texture2D textura = DownloadHandlerTexture.GetContent(request);

                // Cria o Sprite dinamicamente
                // Rect define que usaremos a imagem toda
                // Pivot (0.5, 0.5) coloca o centro no meio da imagem

                float maiorLadoEmPixels = Mathf.Max(textura.width, textura.height);

                // Fórmula: PPU = Pixels / UnidadesDesejadas
                // Exemplo: Imagem 500px para caber em 1.5 unidades -> PPU = 333.33
                float ppuDinamico = maiorLadoEmPixels / tamanhoDesejado;


                Sprite novoSprite = Sprite.Create(
                    textura,
                    new Rect(0, 0, textura.width, textura.height),
                    new Vector2(0.5f, 0.5f),
                    ppuDinamico
                );

                // Aplica na nave
                spriteRenderer.sprite = novoSprite;

                // Opcional: Ajustar escala se a imagem for muito grande
                // transform.localScale = new Vector3(0.5f, 0.5f, 1f); 
            }
        }
    }
}