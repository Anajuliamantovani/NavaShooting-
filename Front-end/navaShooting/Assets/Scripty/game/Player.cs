using UnityEngine;
using UnityEngine.Windows;
//using System;
using System.Collections;
using Unity.VisualScripting;
using UnityEngine.UI;
using UnityEngine.Video;
using UnityEngine.SceneManagement;

public class Player : MonoBehaviour
{
    [SerializeField] private GameObject tiro; 
    private Rigidbody2D rigidbody2;
    [SerializeField] private int velocidade;
    [SerializeField] bool podeTirar;
    Vector2 mov;
    int cont;
    public Sprite tiros;

    public NaveLoader.ShotData shotImpot;

    public gerenciarPowerUops.PowerUpData powerUpData;

    public bool escudo;

    public int vida;

    void Start()
    {
        rigidbody2 = GetComponent<Rigidbody2D>();
        vida = 10;
    }

    void Update()
    {
        movimento();
        atirar();

        if(vida == 0 && escudo == false)
        {
            morreu();
        }
    }

    void movimento()
    {
        float x = UnityEngine.Input.GetAxis("Horizontal");
        float y = UnityEngine.Input.GetAxis("Vertical");

        if (x != 0 || y != 0)
        {
            mov = new Vector2(x, y) * velocidade;
        }
        else if(x != 0 && y != 0)
        {
            mov = (new Vector2(x, y) * velocidade) / 2;
        }
        else if(x == 0 && y == 0)
        {
            mov = new Vector2(0, 0);
        }

        rigidbody2.linearVelocity = mov;
    }

    void atirar()
    {
        if (UnityEngine.Input.GetAxis("Fire1") != 0)
        {
            podeTirar = true;
            if (cont == 0)
            {
                cont++;
                StartCoroutine(contadorTiro());
            }
        }
        else
        {
            podeTirar = false;
        }
    }

    IEnumerator contadorTiro()
    {
        while (podeTirar == true)
        {
            var shot = Instantiate(tiro, transform.position, transform.rotation);
            shot.GetComponent<Shot>().tiro = tiros;
            shot.GetComponent<Shot>().shotImpot = shotImpot;

            yield return new WaitForSeconds(0.2f);
            
        }
        cont = 0;
    }

    

    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.gameObject.GetComponent<powerUps>())
        {
            if (collision.gameObject.GetComponent<powerUps>().meteur == true)
            {
                morreu();
            }
            else
            {
                powerUpData = collision.gameObject.GetComponent<powerUps>().powerUpData;
                transform.localScale = new Vector3(powerUpData.atributo.scale,
                                                    powerUpData.atributo.scale,
                                                    powerUpData.atributo.scale);
                velocidade = (int)powerUpData.atributo.speed;
                escudo = powerUpData.atributo.shield;
                StartCoroutine(this.gameObject.GetComponent<NaveLoader>().CarregarShotDaAPI(this.gameObject.GetComponent<NaveLoader>().tokemP, powerUpData.shot.id));
                Destroy(collision.gameObject);
            }
        }
    }

    public GameObject painel;

    public void morreu()
    {
        Time.timeScale = 0;
        painel.SetActive(true);
    }

    public void jogarNovamente()
    {
        Time.timeScale = 1;
        SceneManager.LoadScene(0);
    }
}
