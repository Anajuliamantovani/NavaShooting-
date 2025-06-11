const jwt = require('jsonwebtoken');
const utils = require('../utils/utils');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ mensagem: 'Não autenticado: Token ausente' });
    }

    // Verifica formato "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ mensagem: 'Não autenticado: Formato de token inválido' });
    }

    const token = parts[1];
    const decodedToken = jwt.verify(token, utils.JWT_KEY);

    req.userData = { id: decodedToken.id };

    
    /* Verifica se o usuário decodificado tem a permissão 'Admin'
    if (decodedToken.permission !== 'Admin') {
        return res.status(403).json({ mensagem: 'Acesso não autorizado: Requer permissão de Admin' });
    }*/

    next();
  } catch (error) {
    return res.status(401).json({ mensagem: 'Não autenticado: Token inválido ou expirado' });
  }
};

