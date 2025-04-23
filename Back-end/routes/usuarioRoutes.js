const express = require('express');
const router = express.Router();

const UsuarioController = require('../controllers/usuarioController');
const checkAuth = require('../middleware/checkAuth');

router.post('/login', UsuarioController.login);
router.post('/password', checkAuth, UsuarioController.password);
router.post('/', checkAuth, UsuarioController.create);
router.put('/', checkAuth, UsuarioController.update);
router.delete('/', checkAuth, UsuarioController.delete);
router.get('/', checkAuth, UsuarioController.getAll);
router.get('/:id', checkAuth, UsuarioController.getOne);

module.exports = router;