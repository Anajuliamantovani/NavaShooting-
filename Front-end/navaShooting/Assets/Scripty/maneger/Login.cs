using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;
using System.Collections;
using System.Text;
using System;
using TMPro;

public class Login : MonoBehaviour
{
    [Header("UI References")]
    [SerializeField] private TMP_InputField emailInput;
    [SerializeField] private TMP_InputField passwordInput;
    [SerializeField] private Button loginButton;
    [SerializeField] private TMP_Text feedbackText;
    [SerializeField] private GameObject loginPanel;
    [SerializeField] private GameObject mainAppPanel;

    [Header("API Configuration")]
    [SerializeField] private string loginUrl = "http://localhost:3000/user/login";

    // Armazena o token e dados do usuário
    public static string AuthToken { get; private set; }
    public static UserData CurrentUser { get; private set; }

    private void Start()
    {
        loginButton.onClick.AddListener(OnLoginClicked);

        // Verifica se já existe um token salvo (login automático)
        CheckSavedToken();
    }

    private void CheckSavedToken()
    {
        if (PlayerPrefs.HasKey("authToken"))
        {
            AuthToken = PlayerPrefs.GetString("authToken");
            string userJson = PlayerPrefs.GetString("userData");
            CurrentUser = JsonUtility.FromJson<UserData>(userJson);

            // Verifica se o token ainda é válido (implementar validação de expiração se necessário)
            //SwitchToMainApp();
            Debug.Log($"Usuário logado: {CurrentUser.nickname} (ID: {CurrentUser.id})");
        }
    }

    public void OnLoginClicked()
    {
        string email = emailInput.text.Trim();
        string password = passwordInput.text;

        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
        {
            ShowFeedback("Email e senha são obrigatórios!", Color.red);
            return;
        }

        StartCoroutine(LoginUser(email, password));
    }

    private IEnumerator LoginUser(string email, string password)
    {
        loginButton.interactable = false;
        ShowFeedback("Autenticando...", Color.blue);

        var loginData = new LoginRequestData
        {
            email = email,
            password = password
        };

        string jsonData = JsonUtility.ToJson(loginData);
        byte[] rawData = Encoding.UTF8.GetBytes(jsonData);

        using (UnityWebRequest request = new UnityWebRequest(loginUrl, "POST"))
        {
            request.uploadHandler = new UploadHandlerRaw(rawData);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");

            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.ConnectionError ||
                request.result == UnityWebRequest.Result.ProtocolError)
            {
                HandleLoginError(request);
            }
            else
            {
                HandleLoginSuccess(request.downloadHandler.text);
            }
        }

        loginButton.interactable = true;
    }

    private void HandleLoginError(UnityWebRequest request)
    {
        if (request.responseCode == 401) // Não autorizado
        {
            ShowFeedback("Credenciais inválidas", Color.red);
        }
        else if (request.responseCode == 403) // Proibido (usuário desativado)
        {
            ShowFeedback("Usuário desativado", Color.red);
        }
        else if (request.responseCode == 400) // Bad Request
        {
            ErrorResponse error = JsonUtility.FromJson<ErrorResponse>(request.downloadHandler.text);
            ShowFeedback(error.mensagem, Color.red);
        }
        else
        {
            ShowFeedback("Erro na conexão: " + request.error, Color.red);
        }
    }

    private void HandleLoginSuccess(string jsonResponse)
    {
        LoginResponse response = JsonUtility.FromJson<LoginResponse>(jsonResponse);

        // Armazena o token e dados do usuário
        AuthToken = response.token;
        CurrentUser = response.user;

        // Salva para sessões futuras
        PlayerPrefs.SetString("authToken", AuthToken);
        PlayerPrefs.SetString("userData", JsonUtility.ToJson(CurrentUser));
        PlayerPrefs.Save();

        ShowFeedback(response.mensagem, Color.green);
        SwitchToMainApp();
    }

    private void SwitchToMainApp()
    {
        loginPanel.SetActive(false);
        mainAppPanel.SetActive(true);

        // Aqui você pode atualizar a UI com os dados do usuário
        Debug.Log($"Usuário logado: {CurrentUser.nickname} (ID: {CurrentUser.id})");
    }

    public void Logout()
    {
        AuthToken = null;
        CurrentUser = null;
        PlayerPrefs.DeleteKey("authToken");
        PlayerPrefs.DeleteKey("userData");

        loginPanel.SetActive(true);
        mainAppPanel.SetActive(false);
        emailInput.text = "";
        passwordInput.text = "";

        ShowFeedback("Você foi desconectado", Color.blue);
    }

    private void ShowFeedback(string message, Color color)
    {
        feedbackText.text = message;
        feedbackText.color = color;
    }

    // Método estático para chamadas autenticadas
    public static IEnumerator AuthenticatedRequest(string url, string method, object data, Action<string> onSuccess, Action<string> onError)
    {
        string jsonData = JsonUtility.ToJson(data);
        byte[] rawData = Encoding.UTF8.GetBytes(jsonData);

        using (UnityWebRequest request = new UnityWebRequest(url, method))
        {
            request.uploadHandler = new UploadHandlerRaw(rawData);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            request.SetRequestHeader("Authorization", "Bearer " + AuthToken);

            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                onSuccess?.Invoke(request.downloadHandler.text);
            }
            else
            {
                onError?.Invoke(request.error);
            }
        }
    }

    // Classes para serialização/desserialização
    [System.Serializable]
    private class LoginRequestData
    {
        public string email;
        public string password;
    }

    [System.Serializable]
    public class LoginResponse
    {
        public string mensagem;
        public string token;
        public int expiresIn;
        public UserData user;
    }

    [System.Serializable]
    public class UserData
    {
        public int id;
        public string nickname;
        public string email;
        public string permission;
        public int level;
        public int coins;
    }

    [System.Serializable]
    private class ErrorResponse
    {
        public string mensagem;
    }
}