/**
 * @file enemiesRouter.js
 * @description Define as rotas para o recurso 'Enemies', conectando-as aos métodos
 * correspondentes no enemiesController.
 */

const express = require('express');
const router = express.Router();
const enemiesController = require('../controllers/enemiesController'); // Certifique-se de que o caminho está correto

// --- Rotas para Inimigos ---

// POST /enemies
// Cria um novo inimigo no sistema.
router.post('/newEnemie', enemiesController.create);

// PUT /enemies
// Atualiza os dados de um inimigo existente. O ID do inimigo é esperado no corpo da requisição.
router.put('/updateEnemie', enemiesController.update);

// DELETE /enemies
// Remove um inimigo do sistema. O ID do inimigo é esperado no corpo da requisição.
router.delete('/removeEnemie', enemiesController.remove);

// GET /enemies/:id
// Obtém um inimigo específico pelo seu ID, que é passado como parâmetro na URL.
router.get('/:idEnemie', enemiesController.getOne);

// GET /enemies
// Obtém todos os inimigos disponíveis no sistema.
router.get('/allEnemies', enemiesController.getAll);

// GET /enemies/wave/:wave
// Obtém uma lista de inimigos filtrados por uma "wave" específica,
// que é passada como parâmetro na URL.
router.get('/wave/:wave', enemiesController.getByWave);

module.exports = router;
