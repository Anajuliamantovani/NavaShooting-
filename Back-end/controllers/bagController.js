const Bag = require('../models/bag');

// Cria uma nova bag
exports.create = async (req, res) => {
  try {
    const { userId, shotId, naveId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ mensagem: 'ID do usuário não definido' });
    }

    const novaBag = await Bag.create({
      userId,
      shotId: shotId || null,
      naveId: naveId || null
    });

    return res.status(201).json({
      mensagem: 'Bag criada com sucesso',
      bag: {
        id: novaBag.id,
        userId: novaBag.userId,
        shotId: novaBag.shotId,
        naveId: novaBag.naveId
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na criação da bag' });
  }
};

// Atualiza dados da bag
exports.update = async (req, res) => {
  try {
    const { id, userId, shotId, naveId } = req.body;
    
    if (!id || !userId) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios não definidos (id, userId)' });
    }

    const bagExistente = await Bag.findByPk(id);
    if (!bagExistente) {
      return res.status(404).json({ mensagem: 'Bag não encontrada' });
    }

    await Bag.update(
      { 
        userId,
        shotId,
        naveId
      },
      { where: { id } }
    );

    const bagAtualizada = await Bag.findByPk(id, {
      include: [
        { association: 'user', attributes: ['id', 'nickname'] },
        { association: 'shot', attributes: ['id', 'name'] },
        { association: 'nave', attributes: ['id', 'name'] }
      ]
    });

    return res.status(200).json({ 
      mensagem: 'Bag alterada com sucesso!',
      bag: bagAtualizada
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na alteração da bag' });
  }
};

// Remove uma bag
exports.remove = async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ mensagem: 'ID não definido' });
    }

    const bagExistente = await Bag.findByPk(id);
    if (!bagExistente) {
      return res.status(404).json({ mensagem: 'Bag não encontrada' });
    }

    await Bag.destroy({ where: { id } });
    return res.status(200).json({ mensagem: 'Bag excluída com sucesso' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na exclusão da bag' });
  }
};

// Obtém uma bag específica com relacionamentos
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    
    const bag = await Bag.findByPk(id, {
      include: [
        { association: 'user', attributes: ['id', 'nickname'] },
        { association: 'shot', attributes: ['id', 'name'] },
        { association: 'nave', attributes: ['id', 'name'] }
      ]
    });

    if (!bag) {
      return res.status(404).json({ mensagem: 'Bag não encontrada' });
    }

    return res.status(200).json({ 
      mensagem: 'Bag encontrada', 
      bag 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao buscar bag' });
  }
};

// Obtém todas as bags com relacionamentos
exports.getAll = async (req, res) => {
  try {
    const bags = await Bag.findAll({
      order: [['id', 'ASC']],
      include: [
        { association: 'user', attributes: ['id', 'nickname'] },
        { association: 'shot', attributes: ['id', 'name'] },
        { association: 'nave', attributes: ['id', 'name'] }
      ]
    });

    return res.status(200).json({ 
      mensagem: 'Bags encontradas', 
      bags 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao listar bags' });
  }
};

// Obtém bags por usuário
exports.getByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const bags = await Bag.findAll({
      where: { userId },
      include: [
        { association: 'shot', attributes: ['id', 'name'] },
        { association: 'nave', attributes: ['id', 'name'] }
      ],
      order: [['id', 'ASC']]
    });

    if (!bags || bags.length === 0) {
      return res.status(404).json({ mensagem: 'Nenhuma bag encontrada para este usuário' });
    }

    return res.status(200).json({ 
      mensagem: 'Bags encontradas', 
      bags 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao buscar bags por usuário' });
  }
};

// Obtém bags por nave
exports.getByNave = async (req, res) => {
  try {
    const { naveId } = req.params;
    
    const bags = await Bag.findAll({
      where: { naveId },
      include: [
        { association: 'user', attributes: ['id', 'nickname'] },
        { association: 'shot', attributes: ['id', 'name'] }
      ],
      order: [['id', 'ASC']]
    });

    if (!bags || bags.length === 0) {
      return res.status(404).json({ mensagem: 'Nenhuma bag encontrada para esta nave' });
    }

    return res.status(200).json({ 
      mensagem: 'Bags encontradas', 
      bags 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao buscar bags por nave' });
  }
};

// Obtém bags por shot
exports.getByShot = async (req, res) => {
  try {
    const { shotId } = req.params;
    
    const bags = await Bag.findAll({
      where: { shotId },
      include: [
        { association: 'user', attributes: ['id', 'nickname'] },
        { association: 'nave', attributes: ['id', 'name'] }
      ],
      order: [['id', 'ASC']]
    });

    if (!bags || bags.length === 0) {
      return res.status(404).json({ mensagem: 'Nenhuma bag encontrada para este shot' });
    }

    return res.status(200).json({ 
      mensagem: 'Bags encontradas', 
      bags 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao buscar bags por shot' });
  }
};

/*
POST /bag/criar
PUT /bag/alterar
GET /bag/consultarUm/:id
GET /bag/consultarTodos
DELETE /bag/excluir
GET /bag/porUsuario/:userId
GET /bag/porNave/:naveId
GET /bag/porShot/:shotId
*/
