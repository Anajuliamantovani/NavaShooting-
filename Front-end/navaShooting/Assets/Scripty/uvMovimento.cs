using UnityEngine;
using UnityEngine.UI;

public class uvMovimento : MonoBehaviour
{

    [SerializeField] private RawImage img;
    [SerializeField] private float x, y, veloct;

    void Update()
    {
        img.uvRect = new Rect(img.uvRect.position + new Vector2(x, y) * Time.deltaTime * veloct, img.uvRect.size);
    }
}
