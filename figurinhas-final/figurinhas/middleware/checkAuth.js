const jwt = require('jsonwebtoken');

const utils = require('../utils/utils');

module.exports = (req, res, next) => {
    const JWT_KEY = utils.JWT_KEY;
    try
    {
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, JWT_KEY);
        req.userData = { id: decodedToken.id };
        next();
    }
    catch(error)
    {
        res.status(401).json({mensagem: 'Não autenticado'});
    }
}