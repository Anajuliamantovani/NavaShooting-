using System.Collections;
using UnityEngine;
using UnityEngine.UI;

public class powerUps : MonoBehaviour
{

    public Rigidbody2D corpo2D;
    public float velocidade;
    public float tempDestroi;
    public bool meteur;
    public int vidaMeteur;
    public Image img;

    public gerenciarPowerUops.PowerUpData powerUpData;
    //public gerenciarPowerUops.AtributoData atributoData;
    //public gerenciarPowerUops.ShotData shotData;

    void Start()
    {
        corpo2D.GetComponent<Rigidbody2D>();
        StartCoroutine(destroirTemp());
    }

    void Update()
    {
        corpo2D.linearVelocity = new Vector2(0, velocidade);
    }

    IEnumerator destroirTemp()
    {
        yield return new WaitForSeconds(tempDestroi);
        if (gameObject.name != "PowerUp")
        {
            Destroy(this.gameObject);
        }
    }

    public void Destroir(int dano)
    {
        vidaMeteur = vidaMeteur - dano;
        if (vidaMeteur <= 0)
        {
            Destroy(this.gameObject);
        }
    }
}
