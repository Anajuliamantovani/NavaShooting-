const Nave = require('../models/nave');

// Cria uma nova nave
exports.create = async (req, res) => {
  try {
    // Nota: Quando usamos multer, os campos de texto vêm em req.body
    // e o arquivo vem em req.file
    const { name, price, masLife, status } = req.body;
    
    // Caminho da imagem para salvar no banco
    let spritePath = null;

    if (req.file) {
        // Salva exemplo: "imagens/1723123123-nave.png"
        // O 'imagens/' vem do alias que criamos no app.js
        spritePath = req.file.filename; 
    }

    if (!name || !status) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios: name, status' });
    }

    const novaNave = await Nave.create({
      name,
      price: price || 0, // Garante que não quebre se vier vazio
      sprite: spritePath, // Aqui entra o nome do arquivo da imagem
      masLife: masLife || 100,
      status
    });

    return res.status(201).json({
      mensagem: 'Nave criada com sucesso',
      nave: novaNave
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na criação da nave' });
  }
};

// Atualiza dados da nave
exports.update = async (req, res) => {
  try {
    const { id, name, price, sprite, masLife, status } = req.body;
    
    if (!id || !name || !status) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios não definidos (id, name, status)' });
    }

    const naveExistente = await Nave.findByPk(id);
    if (!naveExistente) {
      return res.status(404).json({ mensagem: 'Nave não encontrada' });
    }

    await Nave.update(
      { 
        name, 
        price, 
        sprite, 
        masLife, 
        status 
      },
      { where: { id } }
    );

    const naveAtualizada = await Nave.findByPk(id);

    return res.status(200).json({ 
      mensagem: 'Nave alterada com sucesso!',
      nave: naveAtualizada
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na alteração da nave' });
  }
};

// Remove uma nave
exports.remove = async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ mensagem: 'ID não definido' });
    }

    const naveExistente = await Nave.findByPk(id);
    if (!naveExistente) {
      return res.status(404).json({ mensagem: 'Nave não encontrada' });
    }

    await Nave.destroy({ where: { id } });
    return res.status(200).json({ mensagem: 'Nave excluída com sucesso' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na exclusão da nave' });
  }
};

// Obtém uma nave específica
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Sem relacionamentos (include removido)
    const nave = await Nave.findByPk(id, {
      attributes: ['id', 'name', 'price', 'sprite', 'masLife', 'status']
    });

    if (!nave) {
      return res.status(404).json({ mensagem: 'Nave não encontrada' });
    }

    return res.status(200).json({ 
      mensagem: 'Nave encontrada', 
      nave 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao buscar nave' });
  }
};

// Obtém todas as naves
exports.getAll = async (req, res) => {
  try {
    // Sem relacionamentos (include removido)
    const naves = await Nave.findAll({
      order: [['name', 'ASC']],
      attributes: ['id', 'name', 'price', 'sprite', 'masLife', 'status']
    });

    return res.status(200).json({ 
      mensagem: 'Naves encontradas', 
      naves 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao listar naves' });
  }
};

// Ativa uma nave
exports.activate = async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ mensagem: 'ID não definido' });
    }

    const naveExistente = await Nave.findByPk(id);
    if (!naveExistente) {
      return res.status(404).json({ mensagem: 'Nave não encontrada' });
    }

    await Nave.update(
      { status: 'A' },
      { where: { id } }
    );

    return res.status(200).json({ mensagem: 'Nave ativada com sucesso!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao ativar nave' });
  }
};

// Desativa uma nave
exports.deactivate = async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ mensagem: 'ID não definido' });
    }

    const naveExistente = await Nave.findByPk(id);
    if (!naveExistente) {
      return res.status(404).json({ mensagem: 'Nave não encontrada' });
    }

    await Nave.update(
      { status: 'D' },
      { where: { id } }
    );

    return res.status(200).json({ mensagem: 'Nave desativada com sucesso!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao desativar nave' });
  }
};