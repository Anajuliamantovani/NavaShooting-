/**
 * @file storeShotRouter.js
 * @description Define as rotas para o recurso 'StoreShot'
 */

const express = require('express');
const router = express.Router();
const storeShotController = require('../controllers/storeShotController'); 

// --- Rotas para StoreShot ---

// POST /storeShot/newStoreShot
// Cria um novo registro de compra/aquisição de shot
router.post('/newStoreShot', storeShotController.create);

// PUT /storeShot/updateStoreShot
// Atualiza um registro existente
router.put('/updateStoreShot', storeShotController.update);

// DELETE /storeShot/removeStoreShot
// Remove um registro da loja
router.delete('/removeStoreShot', storeShotController.remove);

// GET /storeShot/:id/storeShot
// Obtém um registro específico pelo ID
router.get('/:id/storeShot', storeShotController.getOne);

// GET /storeShot/allStoreShots
// Obtém todos os registros
router.get('/allStoreShots', storeShotController.getAll);

module.exports = router;