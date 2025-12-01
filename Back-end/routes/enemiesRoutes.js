/**
 * @file enemiesRouter.js
 * @description Define as rotas para o recurso 'Enemies', conectando-as aos métodos
 * correspondentes no enemiesController.
 */

const express = require('express');
const router = express.Router();
const enemiesController = require('../controllers/enemiesController'); // Certifique-se de que o caminho está correto
const multer = require('multer');
const path = require('path');
const checkAuth = require('../middleware/checkAuth');

// --- Configuração do Multer (Upload) ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
// --- Rotas para Inimigos ---

// POST /enemies
// Cria um novo inimigo no sistema.
router.post('/newEnemie', checkAuth, upload.single('sprite'), enemiesController.create);

// PUT /enemies
// Atualiza os dados de um inimigo existente. O ID do inimigo é esperado no corpo da requisição.
router.put('/updateEnemie', checkAuth,enemiesController.update);

// DELETE /enemies
// Remove um inimigo do sistema. O ID do inimigo é esperado no corpo da requisição.
router.delete('/removeEnemie', checkAuth,enemiesController.remove);

// GET /enemies/:id
// Obtém um inimigo específico pelo seu ID, que é passado como parâmetro na URL.
router.get('/:id/enemie', checkAuth,enemiesController.getOne);

// GET /enemies
// Obtém todos os inimigos disponíveis no sistema.
router.get('/allEnemies', checkAuth,enemiesController.getAll);

// GET /enemies/wave/:wave
// Obtém uma lista de inimigos filtrados por uma "wave" específica,
// que é passada como parâmetro na URL.
router.get('/wave/:wave', checkAuth,enemiesController.getByWave);

router.post('/activateEnemie', checkAuth, enemiesController.activate);

router.post('/desactivateEnemie', checkAuth, enemiesController.deactivate);

module.exports = router;
