import React, { useState } from 'react';
import axios from 'axios';

const CreateNave = () => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        masLife: '',
        status: 'A' // Padrão Ativo
    });
    
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    // Manipula mudança nos inputs de texto
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- Lógica de Drag and Drop e Seleção de Arquivo ---
    const handleFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file)); // Cria preview para o usuário ver
        } else {
            alert("Por favor, selecione apenas arquivos de imagem.");
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleInputFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    // --- Envio do Formulário ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Para enviar arquivos, OBRIGATORIAMENTE usamos FormData
        const dataToSend = new FormData();
        dataToSend.append('name', formData.name);
        dataToSend.append('price', formData.price);
        dataToSend.append('masLife', formData.masLife);
        dataToSend.append('status', formData.status);
        
        // 'sprite' deve ser o mesmo nome configurado no upload.single('sprite') no Node
        if (imageFile) {
            dataToSend.append('sprite', imageFile);
        }

        const token = localStorage.getItem('token');

        if (!token) {
            alert('Você precisa estar logado para criar uma nave!');
            return;
        }

        try {
            // O Axios detecta que é FormData e configura o header corretamente sozinho
            //const response = await axios.post('http://localhost:3000/naves/newNave', dataToSend);

            const response = await axios.post('http://localhost:3000/naves/newNave', dataToSend, {
                headers: {
                    // 2. Adicionamos o Token
                    'Authorization': `Bearer ${token}`,
                    
                    // IMPORTANTE: NÃO adicione 'Content-Type': 'multipart/form-data' aqui.
                    // O Axios vai detectar o FormData e adicionar o Content-Type 
                    // com o "boundary" correto automaticamente, mantendo o Authorization que passamos.
                }
            });

            alert('Nave criada com sucesso!');
            console.log(response.data);
            
            // Limpar formulário
            setFormData({ name: '', price: '', masLife: '', status: 'A' });
            setImageFile(null);
            setPreview(null);

        } catch (error) {
            console.error("Erro ao criar nave:", error);
            alert('Erro ao criar nave.');
        }
    };

    // --- Estilos Simples (Inline para facilitar) ---
    const styles = {
        container: { maxWidth: '500px', margin: '2rem auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' },
        inputGroup: { marginBottom: '15px' },
        label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
        input: { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
        dropZone: {
            border: dragActive ? '2px dashed #007bff' : '2px dashed #ccc',
            backgroundColor: dragActive ? '#e9f5ff' : '#fafafa',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer',
            borderRadius: '8px',
            marginTop: '10px'
        },
        button: { width: '100%', padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }
    };

    return (
        <div style={styles.container}>
            <h2>Registrar Nova Nave</h2>
            <form onSubmit={handleSubmit}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Nome:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} style={styles.input} required />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Preço:</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} style={styles.input} />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Vida Máxima:</label>
                    <input type="number" name="masLife" value={formData.masLife} onChange={handleChange} style={styles.input} />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Status:</label>
                    <select name="status" value={formData.status} onChange={handleChange} style={styles.input}>
                        <option value="A">Ativo</option>
                        <option value="D">Desativado</option>
                    </select>
                </div>

                {/* Área de Upload (Drag & Drop) */}
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Sprite da Nave (Imagem):</label>
                    <div 
                        style={styles.dropZone}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('fileInput').click()}
                    >
                        <input 
                            id="fileInput" 
                            type="file" 
                            style={{ display: 'none' }} 
                            onChange={handleInputFileChange} 
                            accept="image/*"
                        />
                        {preview ? (
                            <div>
                                <img src={preview} alt="Preview" style={{ maxWidth: '100px', maxHeight: '100px', marginBottom: '10px' }} />
                                <p>Clique ou arraste para trocar</p>
                            </div>
                        ) : (
                            <p>Arraste a imagem aqui ou clique para selecionar</p>
                        )}
                    </div>
                </div>

                <button type="submit" style={styles.button}>Registrar Nave</button>
            </form>
        </div>
    );
};

export default CreateNave;