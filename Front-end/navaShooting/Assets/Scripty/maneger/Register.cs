using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;
using System.Collections;
using System.Text;
using TMPro;

public class Register : MonoBehaviour
{
    [Header("UI References")]
    [SerializeField] private TMP_InputField nicknameInput;
    [SerializeField] private TMP_InputField emailInput;
    [SerializeField] private TMP_InputField passwordInput;
    [SerializeField] private Button registerButton;
    [SerializeField] private TMP_Text feedbackText;

    [Header("API Configuration")]
    [SerializeField] private string apiBaseUrl = "http://localhost:3000/user/register";

    private void Start()
    {
        registerButton.onClick.AddListener(OnRegisterClicked);
    }

    public void OnRegisterClicked()
    {
        string nickname = nicknameInput.text.Trim();
        string email = emailInput.text.Trim();
        string password = passwordInput.text;

        if (string.IsNullOrEmpty(nickname) || string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
        {
            ShowFeedback("Todos os campos são obrigatórios!", Color.red);
            return;
        }

        StartCoroutine(RegisterUser(nickname, email, password));
    }

    private IEnumerator RegisterUser(string nickname, string email, string password)
    {
        registerButton.interactable = false;
        ShowFeedback("Processando registro...", Color.blue);

        // Criar objeto JSON para enviar
        var userData = new UserRegistrationData
        {
            nickname = nickname,
            email = email,
            password = password
        };

        string jsonData = JsonUtility.ToJson(userData);
        byte[] rawData = Encoding.UTF8.GetBytes(jsonData);

        using (UnityWebRequest request = new UnityWebRequest(apiBaseUrl, "POST"))
        {
            request.uploadHandler = new UploadHandlerRaw(rawData);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");

            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.ConnectionError ||
                request.result == UnityWebRequest.Result.ProtocolError)
            {
                HandleError(request);
            }
            else
            {
                HandleSuccess(request.downloadHandler.text);
            }
        }

        registerButton.interactable = true;
    }

    private void HandleError(UnityWebRequest request)
    {
        if (request.responseCode == 409) // Conflito (email/nickname já existe)
        {
            ErrorResponse error = JsonUtility.FromJson<ErrorResponse>(request.downloadHandler.text);
            ShowFeedback(error.mensagem, Color.red);
        }
        else if (request.responseCode == 400) // Bad Request
        {
            ErrorResponse error = JsonUtility.FromJson<ErrorResponse>(request.downloadHandler.text);
            ShowFeedback(error.mensagem, Color.red);
        }
        else
        {
            ShowFeedback("Erro na conexão com o servidor: " + request.error, Color.red);
        }
    }

    private void HandleSuccess(string jsonResponse)
    {
        RegistrationResponse response = JsonUtility.FromJson<RegistrationResponse>(jsonResponse);
        ShowFeedback(response.mensagem, Color.green);

        // Aqui você pode adicionar lógica para mudar de cena ou limpar os campos
        Debug.Log("Usuário registrado com ID: " + response.usuario.id);
    }

    private void ShowFeedback(string message, Color color)
    {
        feedbackText.text = message;
        feedbackText.color = color;
    }

    // Classes auxiliares para serialização/desserialização JSON
    [System.Serializable]
    private class UserRegistrationData
    {
        public string nickname;
        public string email;
        public string password;
    }

    [System.Serializable]
    private class RegistrationResponse
    {
        public string mensagem;
        public UserData usuario;
    }

    [System.Serializable]
    private class UserData
    {
        public int id;
        public string nickname;
        public string email;
        public int level;
        public int coins;
    }

    [System.Serializable]
    private class ErrorResponse
    {
        public string mensagem;
    }
}