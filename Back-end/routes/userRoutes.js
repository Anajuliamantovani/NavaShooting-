const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const checkAuth = require('../middleware/checkAuth');

// Rotas públicas (não requerem autenticação)
router.post('/login', UserController.login);          // Login de usuário
router.post('/register', UserController.create);     // Cadastro de novo usuário

// Rotas protegidas (requerem token JWT válido)
router.get('/', checkAuth, UserController.getAll);               // Listar todos usuários
router.get('/:id', checkAuth, UserController.getOne);            // Obter um usuário específico
router.put('/:id', checkAuth, UserController.update);            // Atualizar informações do usuário
router.delete('/:id', checkAuth, UserController.remove);         // Remover usuário
router.put('/:id/password', checkAuth, UserController.password); // Alterar senha
router.post('/:id/activate', checkAuth, UserController.activate); // Ativar usuário
router.post('/:id/deactivate', checkAuth, UserController.deactivate); // Desativar usuário
router.put('/:id/permission', checkAuth, UserController.updatePermission); // Atualizar permissão
router.post('/:id/coins', checkAuth, UserController.addCoins);   // Adicionar moedas
router.post('/:id/level-up', checkAuth, UserController.levelUp); // Aumentar nível

module.exports = router;