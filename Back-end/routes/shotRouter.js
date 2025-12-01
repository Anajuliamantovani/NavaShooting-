/**
 * @file shotRouter.js
 * @description Define as rotas para o recurso 'Shot', conectando-as aos métodos
 * correspondentes no shotController.
 */

const express = require('express');
const router = express.Router();
const shotController = require('../controllers/shotController'); // Certifique-se de que o caminho está correto
const multer = require('multer');
const path = require('path');
const checkAuth = require('../middleware/checkAuth'); // Importante para segurança


// --- Configuração do Multer (Upload) ---
// Isso permite salvar a imagem na pasta public/uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// --- Rotas para Shots ---

// POST /shots
// Cria um novo shot no sistema.
router.post('/newShot', checkAuth, upload.single('sprite'), shotController.create);

// PUT /shots
// Atualiza os dados de um shot existente. O ID do shot é esperado no corpo da requisição.
router.put('/attShot', checkAuth, shotController.update);

// DELETE /shots
// Remove um shot do sistema. O ID do shot é esperado no corpo da requisição.
router.delete('/removeShot', checkAuth, shotController.remove);

// GET /shots/:id
// Obtém um shot específico pelo seu ID, que é passado como parâmetro na URL.
router.get('/:id/shot', checkAuth, shotController.getOne);

// GET /shots
// Obtém todos os shots disponíveis no sistema.
router.get('/allShots', checkAuth, shotController.getAll);

// POST /shots/activate
// Ativa um shot, alterando seu status para 'A' (Ativo). O ID do shot é esperado no corpo da requisição.
router.post('/activateShot',checkAuth, shotController.activate);

// POST /shots/deactivate
// Desativa um shot, alterando seu status para 'D' (Desativado). O ID do shot é esperado no corpo da requisição.
router.post('/deactivateShot', checkAuth, shotController.deactivate);


module.exports = router;
