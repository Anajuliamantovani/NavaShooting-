const express = require('express');
const router = express.Router();

const TipoController = require('../controllers/tipoController');
const checkAuth = require('../middleware/checkAuth');

router.post('/', checkAuth, TipoController.create);
router.put('/', checkAuth, TipoController.update);
router.delete('/', checkAuth, TipoController.delete);
router.get('/', checkAuth, TipoController.getAll);
router.get('/:id', checkAuth, TipoController.getOne);

module.exports = router;