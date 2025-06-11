const jwt = require('jsonwebtoken');
const utils = require('../utils/utils');

module.exports = (req, res, next) => {
    const JWT_KEY = utils.JWT_KEY;
    try {
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, JWT_KEY);
        req.userData = { id: decodedToken.id };

        // Verifica se o usuário decodificado tem a permissão 'Admin'
        if (decodedToken.permission !== 'Admin') {
            return res.status(403).json({ mensagem: 'Acesso não autorizado: Requer permissão de Admin' });
        }
        
        next(); // Continua para a próxima função middleware ou rota
    } catch(error) {
        // Se o token for inválido ou não existir
        res.status(401).json({ mensagem: 'Não autenticado: Token inválido ou ausente' });
    }
}
