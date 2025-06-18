/**
 * @file bagRouter.js
 * @description Define as rotas para o recurso 'Bag', conectando-as aos métodos
 * correspondentes no bagController.
 */

const express = require('express');
const router = express.Router();
const bagController = require('../controllers/bagController'); // Certifique-se de que o caminho está correto

// --- Rotas para Bags ---

// POST /bags
// Cria uma nova bag no sistema.
router.post('/newBag', bagController.create);
// PUT /bags
// Atualiza os dados de uma bag existente. O ID da bag é esperado no corpo da requisição.
router.put('/updateBag', bagController.update);

// DELETE /bags
// Remove uma bag do sistema. O ID da bag é esperado no corpo da requisição.
router.delete('/removeBag', bagController.remove);

// GET /bags/:id
// Obtém uma bag específica pelo seu ID, que é passado como parâmetro na URL.
router.get('/:idBag', bagController.getOne);

// GET /bags
// Obtém todas as bags disponíveis no sistema.
router.get('/allBags', bagController.getAll);

// GET /bags/user/:userId
// Obtém uma lista de bags filtradas por um ID de usuário específico,
// que é passado como parâmetro na URL.
router.get('/user/:userId', bagController.getByUser);

// GET /bags/nave/:naveId
// Obtém uma lista de bags filtradas por um ID de nave específica,
// que é passado como parâmetro na URL.
router.get('/nave/:naveId', bagController.getByNave);

// GET /bags/shot/:shotId
// Obtém uma lista de bags filtradas por um ID de shot específico,
// que é passado como parâmetro na URL.
router.get('/shot/:shotId', bagController.getByShot);

module.exports = router;
