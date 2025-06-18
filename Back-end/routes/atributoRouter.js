/**
 * @file atributoRouter.js
 * @description Define as rotas para o recurso 'Atributo', conectando-as aos métodos
 * correspondentes no atributoController.
 */

const express = require('express');
const router = express.Router();
const atributoController = require('../controllers/atributoController'); // Certifique-se de que o caminho está correto

// --- Rotas para Atributos ---

// POST /atributos
// Cria um novo atributo no sistema.
router.post('/newAtribute', atributoController.create);

// PUT /atributos
// Atualiza os dados de um atributo existente. O ID do atributo e os campos são esperados no corpo da requisição.
router.put('/updateAtribute', atributoController.update);

// DELETE /atributos
// Remove um atributo do sistema. O ID do atributo é esperado no corpo da requisição.
router.delete('/deleteAtribute', atributoController.remove);

// GET /atributos/:id
// Obtém um atributo específico pelo seu ID, que é passado como parâmetro na URL.
router.get('/:id/atribute', atributoController.getOne);

// GET /atributos
// Obtém todos os atributos disponíveis no sistema.
router.get('/allAtributes', atributoController.getAll);

// GET /atributos/speed-range/:min/:max
// Obtém uma lista de atributos dentro de uma faixa de velocidade específica.
// 'min' e 'max' são passados como parâmetros na URL.
router.get('/speed-range/:min/:max', atributoController.getBySpeedRange);

// GET /atributos/with-shield
// Obtém uma lista de atributos que possuem shield (escudo).
router.get('/with-shield', atributoController.getWithShield);

module.exports = router;
