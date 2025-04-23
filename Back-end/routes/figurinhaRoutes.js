const express = require('express');
const router = express.Router();

const FigurinhaController = require('../controllers/figurinhaController');
const checkAuth = require('../middleware/checkAuth');

router.post('/', checkAuth, FigurinhaController.create);
router.put('/', checkAuth, FigurinhaController.update);
router.delete('/', checkAuth, FigurinhaController.delete);
router.get('/', checkAuth, FigurinhaController.getAll);
router.get('/:id', checkAuth, FigurinhaController.getOne);

module.exports = router;