/**
 * @file powerUpRouter.js
 */
const express = require('express');
const router = express.Router();
const powerUpController = require('../controllers/powerUpController'); 
const multer = require('multer');
const path = require('path');
const checkAuth = require('../middleware/checkAuth');

// --- Configuração do Multer (Upload) ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// --- Rotas para PowerUps ---

// 1. POST e PUT (Criar e Editar)
router.post('/newPowerUp', checkAuth, upload.single('sprite'), powerUpController.create);
router.put('/attPowerUp', checkAuth, powerUpController.update);

// 2. DELETE
router.delete('/removePowerUp', checkAuth, powerUpController.remove);

// 3. AÇÕES ESPECÍFICAS (Ativar/Desativar)
router.post('/activatePowerUp', checkAuth, powerUpController.activate);
router.post('/desactivatePowerUp', checkAuth, powerUpController.deactivate);

// =================================================================
// 4. ROTAS DE BUSCA ESPECÍFICAS (DEVEM VIR ANTES DO /:id) !!!
// =================================================================

// GET /powerups/allPowerUps
router.get('/allPowerUps', checkAuth, powerUpController.getAll);

// GET /powerups/atributo/:atributoId
router.get('/atributo/:atributoId', checkAuth, powerUpController.getByAtributo);

// GET /powerups/shot/:shotId
router.get('/shot/:shotId', checkAuth, powerUpController.getByShot);

// =================================================================
// 5. ROTA DINÂMICA (DEVE SER A ÚLTIMA DE GET) !!!
// =================================================================
// Se esta rota ficar em cima, ela "rouba" o lugar da allPowerUps
// Mudei de :idPowerUp para :id para bater com seu controller
router.get('/:id', checkAuth, powerUpController.getOne);


module.exports = router;