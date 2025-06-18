const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const utils = require('../utils/utils');

// Cria um usuário novo (POST /user/criar)
exports.create = async (req, res) => {
  try {
    const { nickname, email, password } = req.body;
    if (!nickname || !email || !password) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios não definidos (nickname, email, password)' });
    }

    // Verifica se email já existe
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      return res.status(409).json({ mensagem: 'Email já cadastrado' });
    }

    // Verifica se nickname já existe
    const nicknameExists = await User.findOne({ where: { nickname } });
    if (nicknameExists) {
      return res.status(409).json({ mensagem: 'Nickname já em uso' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const novo = await User.create({
      nickname,
      email,
      password: hashed,
      level: 1,
      status: 'A',
      permission: 'User',
      coins: 0
    });

    return res.status(201).json({
      mensagem: 'Usuário criado com sucesso',
      usuario: {
        id: novo.id,
        nickname: novo.nickname,
        email: novo.email,
        level: novo.level,
        coins: novo.coins
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na criação de usuário' });
  }
};

// Atualiza dados do usuário (PUT /user/alterar)
exports.update = async (req, res) => {
  try {
    const { id, email, nickname } = req.body;
    if (!id || !email || !nickname) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios não definidos (id, email, nickname)' });
    }

    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    // Verifica se novo email já existe (outro usuário)
    if (email !== usuario.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(409).json({ mensagem: 'Email já cadastrado para outro usuário' });
      }
    }

    // Verifica se novo nickname já existe (outro usuário)
    if (nickname !== usuario.nickname) {
      const nicknameExists = await User.findOne({ where: { nickname } });
      if (nicknameExists) {
        return res.status(409).json({ mensagem: 'Nickname já em uso por outro usuário' });
      }
    }

    await User.update(
      { email, nickname },
      { where: { id } }
    );

    const usuarioAtualizado = await User.findByPk(id, {
      attributes: ['id', 'nickname', 'email', 'level', 'coins', 'status', 'permission']
    });

    return res.status(200).json({ 
      mensagem: 'Informações atualizadas com sucesso!',
      usuario: usuarioAtualizado
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na atualização do usuário' });
  }
};

// Remove usuário (DELETE /user/excluir)
exports.remove = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ mensagem: 'ID não definido' });
    }

    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    await User.destroy({ where: { id } });
    return res.status(200).json({ mensagem: 'Usuário excluído com sucesso' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na exclusão do usuário' });
  }
};

// Obtém um usuário (GET /user/consultarUm/:id)
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await User.findOne({
      where: { id },
      attributes: ['id', 'nickname', 'email', 'level', 'coins', 'status', 'permission']
    });
    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }
    return res.status(200).json({ 
      mensagem: 'Usuário encontrado', 
      usuario 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao buscar usuário' });
  }
};

// Obtém todos os usuários (GET /user/consultarTodos)
exports.getAll = async (req, res) => {
  try {
    const usuarios = await User.findAll({
      order: [['nickname', 'ASC']],
      attributes: ['id', 'nickname', 'email', 'level', 'coins', 'status', 'permission']
    });
    return res.status(200).json({ 
      mensagem: 'Usuários encontrados', 
      usuarios 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao listar usuários' });
  }
};

// Altera senha (POST /user/password)
exports.password = async (req, res) => {
  try {
    const { id, currentPassword, newPassword } = req.body;
    if (!id || !currentPassword || !newPassword) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios não definidos (id, currentPassword, newPassword)' });
    }

    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    const match = await bcrypt.compare(currentPassword, usuario.password);
    if (!match) {
      return res.status(401).json({ mensagem: 'Senha atual incorreta' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashed }, { where: { id } });

    return res.status(200).json({ 
      mensagem: 'Senha alterada com sucesso!' 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao alterar senha' });
  }
};

// Ativa usuário (POST /user/ativar)
exports.activate = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ mensagem: 'ID não definido' });
    }

    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    await User.update(
      { status: 'A' },
      { where: { id } }
    );

    return res.status(200).json({ 
      mensagem: 'Usuário ativado com sucesso!' 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao ativar usuário' });
  }
};

// Desativa usuário (POST /user/desativar)
exports.deactivate = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ mensagem: 'ID não definido' });
    }

    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    await User.update(
      { status: 'D' },
      { where: { id } }
    );

    return res.status(200).json({ 
      mensagem: 'Usuário desativado com sucesso!' 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao desativar usuário' });
  }
};

// Login e emissão de token (POST /user/login)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios não definidos (email, password)' });
    }

    const usuario = await User.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    if (usuario.status !== 'A') {
      return res.status(403).json({ mensagem: 'Usuário desativado' });
    }

    const match = await bcrypt.compare(password, usuario.password);
    if (!match) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { 
        id: usuario.id,
        nickname: usuario.nickname,
        email: usuario.email,
        permission: usuario.permission 
      }, 
      utils.JWT_KEY, 
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      mensagem: 'Login realizado com sucesso',
      token,
      expiresIn: 14400,
      user: {
        id: usuario.id,
        nickname: usuario.nickname,
        email: usuario.email,
        permission: usuario.permission,
        level: usuario.level,
        coins: usuario.coins
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro no login' });
  }
};

// Atualiza permissão do usuário (POST /user/permission)
exports.updatePermission = async (req, res) => {
  try {
    const { id, permission } = req.body;
    if (!id || !permission) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios não definidos (id, permission)' });
    }

    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    await User.update(
      { permission },
      { where: { id } }
    );

    return res.status(200).json({ 
      mensagem: 'Permissão atualizada com sucesso!',
      permission
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao atualizar permissão' });
  }
};

// Adiciona moedas ao usuário (POST /user/addCoins)
exports.addCoins = async (req, res) => {
  try {
    const { id, coins } = req.body;
    if (!id || !coins) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios não definidos (id, coins)' });
    }

    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    const newCoins = parseInt(usuario.coins || 0) + parseInt(coins);
    await User.update(
      { coins: newCoins },
      { where: { id } }
    );

    return res.status(200).json({ 
      mensagem: 'Moedas adicionadas com sucesso!',
      coins: newCoins
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao adicionar moedas' });
  }
};

// Atualiza nível do usuário (POST /user/levelUp)
exports.levelUp = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ mensagem: 'ID não definido' });
    }

    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    const newLevel = parseInt(usuario.level || 1) + 1;
    await User.update(
      { level: newLevel },
      { where: { id } }
    );

    return res.status(200).json({ 
      mensagem: 'Nível aumentado com sucesso!',
      level: newLevel
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao aumentar nível' });
  }
};

/*
POST /user/criar - Cria novo usuário
PUT /user/alterar - Atualiza dados do usuário
DELETE /user/excluir - Remove usuário
GET /user/consultarUm/:id - Obtém um usuário
GET /user/consultarTodos - Lista todos usuários
POST /user/password - Altera senha
POST /user/ativar - Ativa usuário
POST /user/desativar - Desativa usuário
POST /user/login - Login e geração de token
POST /user/permission - Atualiza permissão
POST /user/addCoins - Adiciona moedas
POST /user/levelUp - Aumenta nível
*/