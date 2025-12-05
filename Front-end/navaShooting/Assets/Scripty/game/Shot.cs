using UnityEngine;
using UnityEngine.Windows;
using System;
using System.Collections;
using UnityEngine.UI;

public class Shot : MonoBehaviour
{

    Rigidbody2D rigidbody2;
    [SerializeField] private float vellocidadeTiro;
    public Sprite tiro;
    public Image imagem;
    public NaveLoader.ShotData shotImpot;

    void Start()
    {
        rigidbody2 = GetComponent<Rigidbody2D>();
        StartCoroutine(contadorDestroir());
    }

    void Update()
    {
        movimento();
        if(tiro != null)
        {
            imagem.sprite = tiro;
        }
    }

    void movimento()
    {
        rigidbody2.linearVelocityY = vellocidadeTiro;
    }

    IEnumerator contadorDestroir()
    {
        yield return new WaitForSeconds(0.5f);
        Destroy(this.gameObject);
    }

    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.tag != "player")
        {
            if (collision.GetComponent<powerUps>())
            {
                if(collision.GetComponent<powerUps>().meteur == true)
                {
                    collision.GetComponent<powerUps>().Destroir(shotImpot.damage);
                    Destroy(this.gameObject);
                }
            }
        }
    }
}
