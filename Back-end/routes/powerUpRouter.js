/**
 * @file powerUpRouter.js
 * @description Define as rotas para o recurso 'PowerUp', conectando-as aos métodos
 * correspondentes no powerUpController.
 */

const express = require('express');
const router = express.Router();
const powerUpController = require('../controllers/powerUpController'); // Certifique-se de que o caminho está correto

// --- Rotas para PowerUps ---

// POST /powerups
// Cria um novo PowerUp no sistema.
router.post('/newPowerUp', powerUpController.create);

// PUT /powerups
// Atualiza os dados de um PowerUp existente. O ID do PowerUp é esperado no corpo da requisição.
router.put('/attPowerUp', powerUpController.update);

// DELETE /powerups
// Remove um PowerUp do sistema. O ID do PowerUp é esperado no corpo da requisição.
router.delete('/removePowerUp', powerUpController.remove);

// GET /powerups/:id
// Obtém um PowerUp específico pelo seu ID, que é passado como parâmetro na URL.
router.get('/:idPowerUp', powerUpController.getOne);

// GET /powerups
// Obtém todos os PowerUps disponíveis no sistema.
router.get('/allPowerUps', powerUpController.getAll);

// GET /powerups/atributo/:atributoId
// Obtém uma lista de PowerUps filtrados por um atributo específico,
// que é passado como parâmetro na URL.
router.get('/atributo/:atributoId', powerUpController.getByAtributo);

// GET /powerups/shot/:shotId
// Obtém uma lista de PowerUps filtrados por um tipo de shot específico,
// que é passado como parâmetro na URL.
router.get('/shot/:shotId', powerUpController.getByShot);

module.exports = router;