/**
 * @file storeEnemiesRouter.js
 * @description Define as rotas para o recurso 'StoreEnemies'
 */

const express = require('express');
const router = express.Router();
const storeEnemiesController = require('../controllers/storeEnemiesController'); 

// --- Rotas para StoreEnemies ---

// POST /storeEnemies/newStoreEnemies
// Cria um novo registro de vínculo de inimigo
router.post('/newStoreEnemies', storeEnemiesController.create);

// PUT /storeEnemies/updateStoreEnemies
// Atualiza um registro existente
router.put('/updateStoreEnemies', storeEnemiesController.update);

// DELETE /storeEnemies/removeStoreEnemies
// Remove um registro da loja
router.delete('/removeStoreEnemies', storeEnemiesController.remove);

// GET /storeEnemies/:id/storeEnemies
// Obtém um registro específico pelo ID
router.get('/:id/storeEnemies', storeEnemiesController.getOne);

// GET /storeEnemies/allStoreEnemies
// Obtém todos os registros
router.get('/allStoreEnemies', storeEnemiesController.getAll);

module.exports = router;