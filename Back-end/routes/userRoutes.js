const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const checkAuth = require('../middleware/checkAuth');
const multer = require('multer');
const path = require('path');

// --- Configuração do Multer (Upload de Imagem) ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // Salva na mesma pasta dos outros
    },
    filename: function (req, file, cb) {
        cb(null, 'user_' + Date.now() + path.extname(file.originalname)); // Prefixo 'user_' para organizar
    }
});

const upload = multer({ storage: storage });

// Rotas públicas
router.post('/login', UserController.login);
router.post('/register', UserController.create);

// Rotas protegidas
router.get('/getAll', checkAuth, UserController.getAll);
router.get('/:id/get', checkAuth, UserController.getOne);
router.put('/:id/update', checkAuth, UserController.update);
router.delete('/:id/remove', checkAuth, UserController.remove);
router.put('/:id/password', checkAuth, UserController.password);
router.post('/:id/activate', checkAuth, UserController.activate);
router.post('/:id/deactivate', checkAuth, UserController.deactivate);
router.put('/:id/permission', checkAuth, UserController.updatePermission);
router.post('/:id/coins', checkAuth, UserController.addCoins);
router.post('/:id/level-up', checkAuth, UserController.addScore);
router.get('/ranking', checkAuth, UserController.getRanking);

// NOVA ROTA: Upload de Avatar
// Usa 'upload.single('profilePic')' -> O campo no form-data deve ser 'profilePic'
router.post('/:id/avatar', checkAuth, upload.single('profilePic'), UserController.uploadAvatar);

module.exports = router;