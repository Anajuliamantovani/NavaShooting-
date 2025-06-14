using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using System.Collections;
using System;

public class MenuController : MonoBehaviour
{
    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void entrarTela(GameObject tela)
    {
        Transform pai = tela.transform.parent;

        for (int x = 0; x < pai.transform.childCount; ++x)
        {
            if (pai.transform.GetChild(x).gameObject.activeSelf == true)
            {
                pai.transform.GetChild(x).gameObject.SetActive(false);
            }
        }
        tela.SetActive(true);
    }
}
