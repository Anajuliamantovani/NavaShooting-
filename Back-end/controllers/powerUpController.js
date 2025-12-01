const PowerUp = require('../models/powerUp');
const Shot = require('../models/shot');       // Importante
const Atributo = require('../models/atributo'); // Importante

// Cria um novo PowerUp
exports.create = async (req, res) => {
  try {
    const { name, status, shotId, atributoId } = req.body;
    
    let spritePath = null;
    if (req.file) {
        spritePath = req.file.filename; 
    }

    if (!status || !spritePath) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios: status e sprite (imagem).' });
    }

    // Tratamento para Foreign Keys vazias
    const finalShotId = (shotId && shotId !== "") ? shotId : null;
    const finalAtributoId = (atributoId && atributoId !== "") ? atributoId : null;

    const novoPowerUp = await PowerUp.create({
      name: name || 'Sem Nome',
      sprite: spritePath,
      status,
      shotId: finalShotId,
      atributoId: finalAtributoId
    });

    return res.status(201).json({
      mensagem: 'PowerUp criado com sucesso',
      powerUp: novoPowerUp
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
    
    if (!id || !status) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios: id, status' });
    }

    const finalShotId = (shotId && shotId !== "") ? shotId : null;
    const finalAtributoId = (atributoId && atributoId !== "") ? atributoId : null;

    const powerUpExistente = await PowerUp.findByPk(id);
    if (!powerUpExistente) {
      return res.status(404).json({ mensagem: 'PowerUp não encontrado' });
    }

    await PowerUp.update(
      { 
        name, 
        sprite, // Nota: Se vier vazio do front, vai apagar a imagem no banco se não tratar. No front mandamos a string antiga.
        status,
        shotId: finalShotId,
        atributoId: finalAtributoId
      },
      { where: { id } }
    );

    return res.status(200).json({ 
      mensagem: 'PowerUp alterado com sucesso!'
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
    if (!id) return res.status(400).json({ mensagem: 'ID não definido' });

    const powerUpExistente = await PowerUp.findByPk(id);
    if (!powerUpExistente) return res.status(404).json({ mensagem: 'PowerUp não encontrado' });

    await PowerUp.destroy({ where: { id } });
    return res.status(200).json({ mensagem: 'PowerUp excluído com sucesso' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na exclusão do PowerUp' });
  }
};

// Ativa
exports.activate = async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) return res.status(400).json({ mensagem: 'ID não definido' });
      await PowerUp.update({ status: 'A' }, { where: { id } });
      return res.status(200).json({ mensagem: 'Ativado com sucesso!' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ mensagem: 'Erro ao ativar' });
    }
};
  
// Desativa
exports.deactivate = async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) return res.status(400).json({ mensagem: 'ID não definido' });
      await PowerUp.update({ status: 'D' }, { where: { id } });
      return res.status(200).json({ mensagem: 'Desativado com sucesso!' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ mensagem: 'Erro ao desativar' });
    }
};

// Obtém um PowerUp específico
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params; // CUIDADO: na rota defini como :id, certifique-se que o router está batendo
    
    const powerUp = await PowerUp.findByPk(id, {
      include: [
        { model: Shot, attributes: ['id', 'name'] },
        { model: Atributo, attributes: ['id', 'speed', 'scale', 'shield'] }
      ],
      attributes: ['id', 'name', 'sprite', 'status', 'shotId', 'atributoId']
    });

    if (!powerUp) return res.status(404).json({ mensagem: 'PowerUp não encontrado' });

    return res.status(200).json({ 
      mensagem: 'PowerUp encontrado', 
      powerUp 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao buscar PowerUp' });
  }
};

// Obtém todos
exports.getAll = async (req, res) => {
  try {
    const powerUps = await PowerUp.findAll({
      order: [['name', 'ASC']],
      include: [
        { model: Shot, attributes: ['id', 'name'] },
        { model: Atributo, attributes: ['id', 'speed', 'scale', 'shield'] }
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

exports.getByAtributo = async (req, res) => {
  try {
    const { atributoId } = req.params;
    
    const powerUps = await PowerUp.findAll({
      where: { atributoId },
      order: [['name', 'ASC']],
      include: [
        { model: Shot, attributes: ['id', 'name'] }
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
        { model: Atributo, attributes: ['id', 'speed', 'scale', 'shield'] }
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