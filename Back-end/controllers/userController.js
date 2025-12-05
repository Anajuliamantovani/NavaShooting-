const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const utils = require('../utils/utils');
const fs = require('fs'); // Para deletar imagem antiga se necessário

// Cria um usuário novo
exports.create = async (req, res) => {
  try {
    const { nickname, email, password } = req.body;
    if (!nickname || !email || !password) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios não definidos' });
    }

    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) return res.status(409).json({ mensagem: 'Email já cadastrado' });

    const nicknameExists = await User.findOne({ where: { nickname } });
    if (nicknameExists) return res.status(409).json({ mensagem: 'Nickname já em uso' });

    const hashed = await bcrypt.hash(password, 10);
    const novo = await User.create({
      nickname,
      email,
      password: hashed,
      score: 0,
      status: 'A',
      permission: 'User',
      coins: 0,
      profilePic: null // Começa sem foto
    });

    return res.status(201).json({
      mensagem: 'Usuário criado com sucesso',
      usuario: {
        id: novo.id,
        nickname: novo.nickname,
        email: novo.email,
        score: novo.score,
        coins: novo.coins,
        profilePic: novo.profilePic
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na criação de usuário' });
  }
};

// Nova Função: Upload de Avatar
exports.uploadAvatar = async (req, res) => {
    try {
        const { id } = req.params;
        const file = req.file; // Arquivo vindo do Multer

        if (!id || !file) {
            return res.status(400).json({ mensagem: 'ID ou Arquivo não fornecidos' });
        }

        const usuario = await User.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }

        // (Opcional) Deletar imagem antiga se existir
        /*
        if (usuario.profilePic) {
            const oldPath = 'public/uploads/' + usuario.profilePic;
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        */

        // Atualiza o banco com o nome do novo arquivo
        await User.update(
            { profilePic: file.filename },
            { where: { id } }
        );

        return res.status(200).json({
            mensagem: 'Avatar atualizado com sucesso!',
            profilePic: file.filename
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ mensagem: 'Erro ao fazer upload do avatar' });
    }
};

// Atualiza dados (com retorno do profilePic)
exports.update = async (req, res) => {
  try {
    const { id, email, nickname } = req.body;
    if (!id || !email || !nickname) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios não definidos' });
    }

    const usuario = await User.findByPk(id);
    if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado' });

    if (email !== usuario.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) return res.status(409).json({ mensagem: 'Email já cadastrado' });
    }

    if (nickname !== usuario.nickname) {
      const nicknameExists = await User.findOne({ where: { nickname } });
      if (nicknameExists) return res.status(409).json({ mensagem: 'Nickname já em uso' });
    }

    await User.update({ email, nickname }, { where: { id } });

    // Busca atualizado INCLUINDO profilePic
    const usuarioAtualizado = await User.findByPk(id, {
      attributes: ['id', 'nickname', 'email', 'score', 'coins', 'status', 'permission', 'profilePic']
    });

    return res.status(200).json({ 
      mensagem: 'Informações atualizadas!',
      usuario: usuarioAtualizado
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na atualização' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ mensagem: 'ID não definido' });
    const usuario = await User.findByPk(id);
    if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    await User.destroy({ where: { id } });
    return res.status(200).json({ mensagem: 'Usuário excluído com sucesso' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na exclusão' });
  }
};

// GetOne com profilePic
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await User.findOne({
      where: { id },
      attributes: ['id', 'nickname', 'email', 'score', 'coins', 'status', 'permission', 'profilePic']
    });
    if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    return res.status(200).json({ mensagem: 'Usuário encontrado', usuario });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao buscar usuário' });
  }
};

// GetAll com profilePic
exports.getAll = async (req, res) => {
  try {
    const usuarios = await User.findAll({
      order: [['nickname', 'ASC']],
      attributes: ['id', 'nickname', 'email', 'score', 'coins', 'status', 'permission', 'profilePic']
    });
    return res.status(200).json({ mensagem: 'Usuários encontrados', usuarios });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao listar usuários' });
  }
};

exports.getRanking = async (req, res) => {
  try {
    const ranking = await User.findAll({
      order: [['score', 'DESC']],
      attributes: ['nickname', 'score', 'profilePic'], // Incluí profilePic no ranking também!
      where: { status: 'A' },
    });
    return res.status(200).json({ mensagem: 'Ranking carregado', ranking });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao carregar ranking' });
  }
};

exports.password = async (req, res) => {
  try {
    const { id, currentPassword, newPassword } = req.body;
    if (!id || !currentPassword || !newPassword) return res.status(400).json({ mensagem: 'Dados incompletos' });
    const usuario = await User.findByPk(id);
    if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    const match = await bcrypt.compare(currentPassword, usuario.password);
    if (!match) return res.status(401).json({ mensagem: 'Senha incorreta' });
    const hashed = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashed }, { where: { id } });
    return res.status(200).json({ mensagem: 'Senha alterada!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao alterar senha' });
  }
};

exports.activate = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ mensagem: 'ID não definido' });
    const usuario = await User.findByPk(id);
    if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    await User.update({ status: 'A' }, { where: { id } });
    return res.status(200).json({ mensagem: 'Usuário ativado!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao ativar' });
  }
};

exports.deactivate = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ mensagem: 'ID não definido' });
    const usuario = await User.findByPk(id);
    if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    await User.update({ status: 'D' }, { where: { id } });
    return res.status(200).json({ mensagem: 'Usuário desativado!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao desativar' });
  }
};

// Login (retorna profilePic)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ mensagem: 'Dados incompletos' });

    const usuario = await User.findOne({ where: { email } });
    if (!usuario) return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    if (usuario.status !== 'A') return res.status(403).json({ mensagem: 'Usuário desativado' });

    const match = await bcrypt.compare(password, usuario.password);
    if (!match) return res.status(401).json({ mensagem: 'Credenciais inválidas' });

    const token = jwt.sign(
      { id: usuario.id, nickname: usuario.nickname, email: usuario.email, permission: usuario.permission }, 
      utils.JWT_KEY, 
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      mensagem: 'Login realizado com sucesso',
      token,
      expiresIn: 10800,
      user: {
        id: usuario.id,
        nickname: usuario.nickname,
        email: usuario.email,
        permission: usuario.permission,
        score: usuario.score,
        coins: usuario.coins,
        profilePic: usuario.profilePic // Importante para o menu!
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro no login' });
  }
};

exports.updatePermission = async (req, res) => {
  try {
    const { id, permission } = req.body;
    if (!id || !permission) return res.status(400).json({ mensagem: 'Dados incompletos' });
    const usuario = await User.findByPk(id);
    if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    await User.update({ permission }, { where: { id } });
    return res.status(200).json({ mensagem: 'Permissão atualizada!', permission });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao atualizar permissão' });
  }
};

exports.addCoins = async (req, res) => {
  try {
    const { id, coins } = req.body;
    if (!id || !coins) return res.status(400).json({ mensagem: 'Dados incompletos' });
    const usuario = await User.findByPk(id);
    if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    const newCoins = parseInt(usuario.coins || 0) + parseInt(coins);
    await User.update({ coins: newCoins }, { where: { id } });
    return res.status(200).json({ mensagem: 'Moedas adicionadas!', coins: newCoins });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao adicionar moedas' });
  }
};

exports.addScore = async (req, res) => {
  try {
    const { id, score } = req.body;
    if (!id || score === undefined) return res.status(400).json({ mensagem: 'Dados incompletos' });
    const usuario = await User.findByPk(id);
    if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    const newScore = parseInt(usuario.score || 0) + parseInt(score);
    await User.update({ score: newScore }, { where: { id } });
    return res.status(200).json({ mensagem: 'Score atualizado!', score: newScore });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao atualizar score' });
  }
};