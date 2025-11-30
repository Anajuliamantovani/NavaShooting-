const Enemies = require('../models/enemies');

// Cria um novo inimigo
exports.create = async (req, res) => {
  try {
    const { name, sprite, movement, coinsDropped, wave, score, status, shotId, atributoId } = req.body;
    
    // Validação: Todos os campos 'allowNull: false' do model
    if (!name || !sprite || !movement || !coinsDropped || !wave || !score || !status) {
      return res.status(400).json({ 
        mensagem: 'Campos obrigatórios não definidos (name, sprite, movement, coinsDropped, wave, score, status)' 
      });
    }

    const novoInimigo = await Enemies.create({
      name,
      sprite,
      movement,
      coinsDropped,
      wave,
      score,
      status,
      shotId: shotId || null,
      atributoId: atributoId || null
    });

    return res.status(201).json({
      mensagem: 'Inimigo criado com sucesso',
      enemy: {
        id: novoInimigo.id,
        name: novoInimigo.name,
        sprite: novoInimigo.sprite,
        movement: novoInimigo.movement,
        coinsDropped: novoInimigo.coinsDropped,
        wave: novoInimigo.wave,
        score: novoInimigo.score,
        status: novoInimigo.status,
        shotId: novoInimigo.shotId,
        atributoId: novoInimigo.atributoId
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na criação do inimigo' });
  }
};

// Atualiza dados do inimigo
exports.update = async (req, res) => {
  try {
    const { id, name, sprite, movement, coinsDropped, wave, score, status, shotId, atributoId } = req.body;
    
    if (!id || !name || !sprite || !movement || !coinsDropped || !wave || !score || !status) {
      return res.status(400).json({ 
        mensagem: 'Campos obrigatórios não definidos (id, name, sprite, movement, coinsDropped, wave, score, status)' 
      });
    }

    const inimigoExistente = await Enemies.findByPk(id);
    if (!inimigoExistente) {
      return res.status(404).json({ mensagem: 'Inimigo não encontrado' });
    }

    await Enemies.update(
      { 
        name, 
        sprite, 
        movement, 
        coinsDropped, 
        wave,
        score,
        status,
        shotId,
        atributoId
      },
      { where: { id } }
    );

    const inimigoAtualizado = await Enemies.findByPk(id, {
      include: [
        { association: 'shot', attributes: ['id', 'name'] },
        { association: 'atributo', attributes: ['id', 'name'] }
      ]
    });

    return res.status(200).json({ 
      mensagem: 'Inimigo alterado com sucesso!',
      enemy: inimigoAtualizado
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na alteração do inimigo' });
  }
};

// Remove um inimigo
exports.remove = async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ mensagem: 'ID não definido' });
    }

    const inimigoExistente = await Enemies.findByPk(id);
    if (!inimigoExistente) {
      return res.status(404).json({ mensagem: 'Inimigo não encontrado' });
    }

    await Enemies.destroy({ where: { id } });
    return res.status(200).json({ mensagem: 'Inimigo excluído com sucesso' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na exclusão do inimigo' });
  }
};

// Obtém um inimigo específico com relacionamentos
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    
    const enemy = await Enemies.findByPk(id, {
      include: [
        { association: 'shot', attributes: ['id', 'name'] },
        { association: 'atributo', attributes: ['id', 'name'] }
      ],
      attributes: ['id', 'name', 'sprite', 'movement', 'coinsDropped', 'wave', 'score', 'status', 'shotId', 'atributoId']
    });

    if (!enemy) {
      return res.status(404).json({ mensagem: 'Inimigo não encontrado' });
    }

    return res.status(200).json({ 
      mensagem: 'Inimigo encontrado', 
      enemy 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao buscar inimigo' });
  }
};

// Obtém todos os inimigos com relacionamentos básicos
exports.getAll = async (req, res) => {
  try {
    const enemies = await Enemies.findAll({
      order: [['wave', 'ASC'], ['name', 'ASC']],
      include: [
        { association: 'shot', attributes: ['id', 'name'] },
        { association: 'atributo', attributes: ['id', 'name'] }
      ],
      attributes: ['id', 'name', 'sprite', 'movement', 'coinsDropped', 'wave', 'score', 'status', 'shotId', 'atributoId']
    });

    return res.status(200).json({ 
      mensagem: 'Inimigos encontrados', 
      enemies 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao listar inimigos' });
  }
};

// Obtém inimigos por wave
exports.getByWave = async (req, res) => {
  try {
    const { wave } = req.params;
    
    const enemies = await Enemies.findAll({
      where: { wave },
      order: [['name', 'ASC']],
      include: [
        { association: 'shot', attributes: ['id', 'name'] },
        { association: 'atributo', attributes: ['id', 'name'] }
      ],
      attributes: ['id', 'name', 'sprite', 'movement', 'coinsDropped', 'wave', 'score', 'status', 'shotId', 'atributoId']
    });

    if (!enemies || enemies.length === 0) {
      return res.status(404).json({ mensagem: 'Nenhum inimigo encontrado para esta wave' });
    }

    return res.status(200).json({ 
      mensagem: 'Inimigos encontrados', 
      enemies 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao buscar inimigos por wave' });
  }
};