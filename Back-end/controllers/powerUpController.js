const PowerUp = require('../models/powerUp');

// Cria um novo PowerUp
exports.create = async (req, res) => {
  try {
    const { name, sprite, status, shotId, atributoId } = req.body;
    
    // Validação: 'status' é obrigatório no banco. 'name' e 'sprite' validamos por regra de negócio.
    if (!status) {
      return res.status(400).json({ mensagem: 'O campo status é obrigatório.' });
    }

    const novoPowerUp = await PowerUp.create({
      name: name || null,
      sprite: sprite || null,
      status,
      shotId: shotId || null,
      atributoId: atributoId || null
    });

    return res.status(201).json({
      mensagem: 'PowerUp criado com sucesso',
      powerUp: {
        id: novoPowerUp.id,
        name: novoPowerUp.name,
        sprite: novoPowerUp.sprite,
        status: novoPowerUp.status,
        shotId: novoPowerUp.shotId,
        atributoId: novoPowerUp.atributoId
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na criação do PowerUp' });
  }
};

// Atualiza dados do PowerUp
exports.update = async (req, res) => {
  try {
    const { id, name, sprite, status, shotId, atributoId } = req.body;
    
    // Validação básica
    if (!id || !status) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios não definidos (id, status)' });
    }

    const powerUpExistente = await PowerUp.findByPk(id);
    if (!powerUpExistente) {
      return res.status(404).json({ mensagem: 'PowerUp não encontrado' });
    }

    await PowerUp.update(
      { 
        name, 
        sprite,
        status,
        shotId,
        atributoId
      },
      { where: { id } }
    );

    const powerUpAtualizado = await PowerUp.findByPk(id, {
      include: [
        { association: 'shot', attributes: ['id', 'name'] },
        { association: 'atributo', attributes: ['id', 'name'] }
      ]
    });

    return res.status(200).json({ 
      mensagem: 'PowerUp alterado com sucesso!',
      powerUp: powerUpAtualizado
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na alteração do PowerUp' });
  }
};

// Remove um PowerUp
exports.remove = async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ mensagem: 'ID não definido' });
    }

    const powerUpExistente = await PowerUp.findByPk(id);
    if (!powerUpExistente) {
      return res.status(404).json({ mensagem: 'PowerUp não encontrado' });
    }

    await PowerUp.destroy({ where: { id } });
    return res.status(200).json({ mensagem: 'PowerUp excluído com sucesso' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na exclusão do PowerUp' });
  }
};

// Obtém um PowerUp específico com relacionamentos
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    
    const powerUp = await PowerUp.findByPk(id, {
      include: [
        { association: 'shot', attributes: ['id', 'name'] },
        { association: 'atributo', attributes: ['id', 'name'] }
      ],
      attributes: ['id', 'name', 'sprite', 'status', 'shotId', 'atributoId']
    });

    if (!powerUp) {
      return res.status(404).json({ mensagem: 'PowerUp não encontrado' });
    }

    return res.status(200).json({ 
      mensagem: 'PowerUp encontrado', 
      powerUp 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao buscar PowerUp' });
  }
};

// Obtém todos os PowerUps com relacionamentos
exports.getAll = async (req, res) => {
  try {
    const powerUps = await PowerUp.findAll({
      order: [['name', 'ASC']],
      include: [
        { association: 'shot', attributes: ['id', 'name'] },
        { association: 'atributo', attributes: ['id', 'name'] }
      ],
      attributes: ['id', 'name', 'sprite', 'status', 'shotId', 'atributoId']
    });

    return res.status(200).json({ 
      mensagem: 'PowerUps encontrados', 
      powerUps 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao listar PowerUps' });
  }
};

// Obtém PowerUps por atributo
exports.getByAtributo = async (req, res) => {
  try {
    const { atributoId } = req.params;
    
    const powerUps = await PowerUp.findAll({
      where: { atributoId },
      order: [['name', 'ASC']],
      include: [
        { association: 'shot', attributes: ['id', 'name'] }
      ],
      attributes: ['id', 'name', 'sprite', 'status', 'shotId', 'atributoId']
    });

    if (!powerUps || powerUps.length === 0) {
      return res.status(404).json({ mensagem: 'Nenhum PowerUp encontrado para este atributo' });
    }

    return res.status(200).json({ 
      mensagem: 'PowerUps encontrados', 
      powerUps 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao buscar PowerUps por atributo' });
  }
};

// Obtém PowerUps por tipo de shot
exports.getByShot = async (req, res) => {
  try {
    const { shotId } = req.params;
    
    const powerUps = await PowerUp.findAll({
      where: { shotId },
      order: [['name', 'ASC']],
      include: [
        { association: 'atributo', attributes: ['id', 'name'] }
      ],
      attributes: ['id', 'name', 'sprite', 'status', 'shotId', 'atributoId']
    });

    if (!powerUps || powerUps.length === 0) {
      return res.status(404).json({ mensagem: 'Nenhum PowerUp encontrado para este tipo de shot' });
    }

    return res.status(200).json({ 
      mensagem: 'PowerUps encontrados', 
      powerUps 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao buscar PowerUps por shot' });
  }
};

/*
POST /powerup/criar
PUT /powerup/alterar
GET /powerup/consultarUm/:id
GET /powerup/consultarTodos
DELETE /powerup/excluir
GET /powerup/porAtributo/:atributoId
GET /powerup/porShot/:shotId
*/