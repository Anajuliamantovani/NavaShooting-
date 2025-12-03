/**
 * @file storeNaveRouter.js
 * @description Define as rotas para o recurso 'StoreNave'
 */

const express = require('express');
const router = express.Router();
const storeNaveController = require('../controllers/storeNaveController'); 

// --- Rotas para StoreNave ---

// POST /storeNave/newStoreNave
// Cria um novo registro de compra/aquisição de nave
router.post('/newStoreNave', storeNaveController.create);

// PUT /storeNave/updateStoreNave
// Atualiza um registro existente
router.put('/updateStoreNave', storeNaveController.update);

// DELETE /storeNave/removeStoreNave
// Remove um registro da loja
router.delete('/removeStoreNave', storeNaveController.remove);

// GET /storeNave/:id/storeNave
// Obtém um registro específico pelo ID
router.get('/:id/storeNave', storeNaveController.getOne);

// GET /storeNave/allStoreNaves
// Obtém todos os registros
router.get('/allStoreNaves', storeNaveController.getAll);

router.get('/user/:userId', storeNaveController.getByUser);

module.exports = router;