using UnityEngine;
using UnityEngine.Networking;
using TMPro;
using System.Collections;
using System.Collections.Generic;
using UnityEngine.UI;

public class UserListManager : MonoBehaviour
{
    [Header("References")]
    [SerializeField] private string apiUrl = "http://localhost:3000/user/getAll";
    [SerializeField] private GameObject userPrefab; // Seu prefab com componentes TMP_Text
    [SerializeField] private Transform contentParent; // Onde os prefabs serão instanciados (ex: Content de ScrollView)
    [SerializeField] private Button Button;

    [Header("UI Feedback")]
    [SerializeField] private TMP_Text statusText;

    private void Start()
    {
        // Opcional: carregar automaticamente ao iniciar
        Button.onClick.AddListener(RefreshUserList);
        //StartCoroutine(LoadUsers());
    }

    public void RefreshUserList()
    {
        StartCoroutine(LoadUsers());
    }

    private IEnumerator LoadUsers()
    {
        statusText.text = "Carregando usuários...";
        statusText.color = Color.yellow;

        // Limpa a lista atual
        foreach (Transform child in contentParent)
        {
            Destroy(child.gameObject);
        }

        using (UnityWebRequest request = UnityWebRequest.Get(apiUrl))
        {
            // Adiciona o token de autenticação
            if (!string.IsNullOrEmpty(Login.AuthToken))
            {
                request.SetRequestHeader("Authorization", "Bearer " + Login.AuthToken);
            }
            else
            {
                statusText.text = "Erro: Usuário não autenticado";
                statusText.color = Color.red;
                yield break;
            }

            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                ProcessUserData(request.downloadHandler.text);
            }
            else
            {
                HandleRequestError(request);
            }
        }
    }

    private void ProcessUserData(string jsonResponse)
    {
        try
        {
            UserListResponse response = JsonUtility.FromJson<UserListResponse>(jsonResponse);

            if (response.usuarios != null && response.usuarios.Length > 0)
            {
                foreach (UserData user in response.usuarios)
                {
                    CreateUserPrefab(user);
                }
                statusText.text = $"Carregados {response.usuarios.Length} usuários";
                statusText.color = Color.green;
            }
            else
            {
                statusText.text = "Nenhum usuário encontrado";
                statusText.color = Color.yellow;
            }
        }
        catch (System.Exception e)
        {
            statusText.text = "Erro ao processar dados: " + e.Message;
            statusText.color = Color.red;
        }
    }

    private void CreateUserPrefab(UserData user)
    {
        GameObject userEntry = Instantiate(userPrefab, contentParent);

        // Supondo que seu prefab tenha estes componentes TMP_Text
        userEntry.transform.Find("Txt_Id").GetComponent<TMP_Text>().text = user.id.ToString();
        userEntry.transform.Find("Txt_Nickname").GetComponent<TMP_Text>().text = user.nickname;
        userEntry.transform.Find("Txt_Email").GetComponent<TMP_Text>().text = user.email;
        userEntry.transform.Find("Txt_Level").GetComponent<TMP_Text>().text = user.level.ToString();
        userEntry.transform.Find("Txt_Coins").GetComponent<TMP_Text>().text = user.coins.ToString();
        userEntry.transform.Find("Txt_Status").GetComponent<TMP_Text>().text = user.status;
        userEntry.transform.Find("Txt_Permission").GetComponent<TMP_Text>().text = user.permission;
        userEntry.SetActive(true);
        userEntry.transform.SetParent(contentParent.parent);

        // Você pode adicionar botões ou outras interações aqui
    }

    private void HandleRequestError(UnityWebRequest request)
    {
        if (request.responseCode == 401) // Não autorizado
        {
            statusText.text = "Acesso não autorizado - Token inválido";
            statusText.color = Color.red;
        }
        else if (request.responseCode == 403) // Proibido
        {
            statusText.text = "Acesso negado - Permissões insuficientes";
            statusText.color = Color.red;
        }
        else
        {
            statusText.text = "Erro: " + request.error;
            statusText.color = Color.red;
        }
    }

    // Classes para desserialização
    [System.Serializable]
    private class UserListResponse
    {
        public string mensagem;
        public UserData[] usuarios;
    }

    [System.Serializable]
    public class UserData
    {
        public int id;
        public string nickname;
        public string email;
        public int level;
        public int coins;
        public string status;
        public string permission;
    }
}