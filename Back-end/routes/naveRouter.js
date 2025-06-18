/**
 * @file naveRouter.js
 * @description Define as rotas para o recurso 'Nave', conectando-as aos métodos
 * correspondentes no naveController.
 */

const express = require('express');
const router = express.Router();
const naveController = require('../controllers/naveController'); // Certifique-se de que o caminho está correto

// --- Rotas para Naves ---

// POST /naves
// Cria uma nova nave no sistema.
router.post('/newNave', naveController.create);

// PUT /naves
// Atualiza os dados de uma nave existente. O ID da nave é esperado no corpo da requisição.
router.put('/updateNave', naveController.update);

// DELETE /naves
// Remove uma nave do sistema. O ID da nave é esperado no corpo da requisição.
router.delete('/removeNave', naveController.remove);

// GET /naves/:id
// Obtém uma nave específica pelo seu ID, que é passado como parâmetro na URL.
router.get('/:id/nave', naveController.getOne);

// GET /naves
// Obtém todas as naves disponíveis no sistema.
router.get('/allNaves', naveController.getAll);

// POST /naves/activate
// Ativa uma nave, alterando seu status para 'A' (Ativo). O ID da nave é esperado no corpo da requisição.
router.post('/activateNave', naveController.activate);

// POST /naves/deactivate
// Desativa uma nave, alterando seu status para 'D' (Desativado). O ID da nave é esperado no corpo da requisição.
router.post('/desactivateNave', naveController.deactivate);

module.exports = router;
