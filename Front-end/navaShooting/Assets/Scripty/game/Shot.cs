using UnityEngine;
using UnityEngine.Windows;
using System;
using System.Collections;

public class Shot : MonoBehaviour
{

    Rigidbody2D rigidbody2;
    [SerializeField] private float vellocidadeTiro;

    void Start()
    {
        rigidbody2 = GetComponent<Rigidbody2D>();
        StartCoroutine(contadorDestroir());
    }

    void Update()
    {
        movimento();
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

}
