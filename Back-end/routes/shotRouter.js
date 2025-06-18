/**
 * @file shotRouter.js
 * @description Define as rotas para o recurso 'Shot', conectando-as aos métodos
 * correspondentes no shotController.
 */

const express = require('express');
const router = express.Router();
const shotController = require('../controllers/shotController'); // Certifique-se de que o caminho está correto

// --- Rotas para Shots ---

// POST /shots
// Cria um novo shot no sistema.
router.post('/newShot', shotController.create);

// PUT /shots
// Atualiza os dados de um shot existente. O ID do shot é esperado no corpo da requisição.
router.put('/attShot', shotController.update);

// DELETE /shots
// Remove um shot do sistema. O ID do shot é esperado no corpo da requisição.
router.delete('/removeShot', shotController.remove);

// GET /shots/:id
// Obtém um shot específico pelo seu ID, que é passado como parâmetro na URL.
router.get('/:id/shot', shotController.getOne);

// GET /shots
// Obtém todos os shots disponíveis no sistema.
router.get('/allShots', shotController.getAll);

// POST /shots/activate
// Ativa um shot, alterando seu status para 'A' (Ativo). O ID do shot é esperado no corpo da requisição.
router.post('/activateShot', shotController.activate);

// POST /shots/deactivate
// Desativa um shot, alterando seu status para 'D' (Desativado). O ID do shot é esperado no corpo da requisição.
router.post('/deactivateShot', shotController.deactivate);

// GET /shots/permission/:permission
// Obtém uma lista de shots filtrados por um tipo de permissão específica,
// que é passada como parâmetro na URL.
router.get('/permission/:permission', shotController.getByPermission);

module.exports = router;
