const Nave = require('../models/nave');

// Cria uma nova nave
exports.create = async (req, res) => {
  try {
    const { name, price, spriteId, powerUpId, shotId, atributoId } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios não definidos (name, price)' });
    }

    const novaNave = await Nave.create({
      name,
      price,
      spriteId: spriteId || null,
      powerUpId: powerUpId || null,
      shotId: shotId || null,
      atributoId: atributoId || null,
      status: 'A'
    });

    return res.status(201).json({
      mensagem: 'Nave criada com sucesso',
      nave: {
        id: novaNave.id,
        name: novaNave.name,
        price: novaNave.price,
        spriteId: novaNave.spriteId,
        powerUpId: novaNave.powerUpId,
        shotId: novaNave.shotId,
        atributoId: novaNave.atributoId,
        status: novaNave.status
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na criação da nave' });
  }
};

// Atualiza dados da nave
exports.update = async (req, res) => {
  try {
    const { id, name, price, spriteId, powerUpId, shotId, atributoId } = req.body;
    
    if (!id || !name || !price) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios não definidos (id, name, price)' });
    }

    const naveExistente = await Nave.findByPk(id);
    if (!naveExistente) {
      return res.status(404).json({ mensagem: 'Nave não encontrada' });
    }

    await Nave.update(
      { 
        name, 
        price, 
        spriteId, 
        powerUpId, 
        shotId, 
        atributoId 
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

// Obtém uma nave específica com relacionamentos
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    
    const nave = await Nave.findByPk(id, {
      include: [
        { association: 'powerUp', attributes: ['id', 'name'] },
        { association: 'shot', attributes: ['id', 'name'] },
        { association: 'atributo', attributes: ['id', 'name'] }
      ],
      attributes: ['id', 'name', 'price', 'spriteId', 'status']
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

// Obtém todas as naves com relacionamentos básicos
exports.getAll = async (req, res) => {
  try {
    const naves = await Nave.findAll({
      order: [['name', 'ASC']],
      include: [
        { association: 'powerUp', attributes: ['id', 'name'] },
        { association: 'shot', attributes: ['id', 'name'] },
        { association: 'atributo', attributes: ['id', 'name'] }
      ],
      attributes: ['id', 'name', 'price', 'spriteId', 'status']
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