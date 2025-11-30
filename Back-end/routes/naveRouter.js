/**
 * @file naveRouter.js
 * @description Define as rotas para o recurso 'Nave', conectando-as aos métodos
 * correspondentes no naveController.
 */

const express = require('express');
const router = express.Router();
const naveController = require('../controllers/naveController'); // Certifique-se de que o caminho está correto
const multer = require('multer');
const path = require('path');
const checkAuth = require('../middleware/checkAuth');


// --- Configuração do Multer (Upload) ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Salva na pasta public/uploads que criamos antes
        cb(null, 'public/uploads/'); 
    },
    filename: function (req, file, cb) {
        // Gera um nome único: timestamp + extensão original
        // Ex: 123456789-nave.png
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/newNave',checkAuth, upload.single('sprite'), naveController.create);

// --- Rotas para Naves ---

// POST /naves
// Cria uma nova nave no sistema.
//router.post('/newNave',checkAuth, naveController.create);

// PUT /naves
// Atualiza os dados de uma nave existente. O ID da nave é esperado no corpo da requisição.
router.put('/updateNave',checkAuth, naveController.update);

// DELETE /naves
// Remove uma nave do sistema. O ID da nave é esperado no corpo da requisição.
router.delete('/removeNave',checkAuth, naveController.remove);

// GET /naves/:id
// Obtém uma nave específica pelo seu ID, que é passado como parâmetro na URL.
router.get('/:id/nave',checkAuth, naveController.getOne);

// GET /naves
// Obtém todas as naves disponíveis no sistema.
router.get('/allNaves',checkAuth, naveController.getAll);

// POST /naves/activate
// Ativa uma nave, alterando seu status para 'A' (Ativo). O ID da nave é esperado no corpo da requisição.
router.post('/activateNave',checkAuth, naveController.activate);

// POST /naves/deactivate
// Desativa uma nave, alterando seu status para 'D' (Desativado). O ID da nave é esperado no corpo da requisição.
router.post('/desactivateNave',checkAuth, naveController.deactivate);

module.exports = router;
