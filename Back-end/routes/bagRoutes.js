const express = require('express');
const router = express.Router();

const bagController = require('../controllers/bagController');
const checkAuth = require('../middleware/checkAuth');


// Rota pública para cadastro de usuário (se desejar permitir novos cadastros sem token)
router.post('/', bagController.create); 

// Rotas protegidas por JWT
router.get('/',  checkAuth, UsuarioController.getAll);
router.get('/:id', checkAuth, UsuarioController.getOne);
router.put('/:id', checkAuth, UsuarioController.update);
router.delete('/:id', checkAuth, UsuarioController.remove);

// Alteração de senha (pode ser também PUT '/:id/password' para ficar mais claro)
router.post('/:id/password', checkAuth, UsuarioController.password);

module.exports = router;
