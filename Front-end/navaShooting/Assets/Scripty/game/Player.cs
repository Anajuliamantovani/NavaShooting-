using UnityEngine;
using UnityEngine.Windows;
//using System;
using System.Collections;
using Unity.VisualScripting;
using UnityEngine.UI;

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

    void Start()
    {
        rigidbody2 = GetComponent<Rigidbody2D>();
    }

    void Update()
    {
        movimento();
        atirar();
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

}
