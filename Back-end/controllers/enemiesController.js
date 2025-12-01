const Enemies = require('../models/enemies');
const Shot = require('../models/shot');       // <--- IMPORTANTE: Importar o Model Shot
const Atributo = require('../models/atributo'); // <--- IMPORTANTE: Importar o Model Atributo

// Cria um novo inimigo
exports.create = async (req, res) => {
  try {
    const { name, movement, coinsDropped, wave, score, status, shotId, atributoId } = req.body;
    
    let spritePath = null;
    if (req.file) {
        spritePath = req.file.filename; 
    }

    if (!name || !spritePath || !movement || !coinsDropped || !wave || !score || !status) {
      return res.status(400).json({ 
        mensagem: 'Campos obrigatórios: name, sprite, movement, coinsDropped, wave, score, status' 
      });
    }

    // Tratamento para Foreign Keys vazias
    const finalShotId = (shotId && shotId !== "") ? shotId : null;
    const finalAtributoId = (atributoId && atributoId !== "") ? atributoId : null;

    const novoInimigo = await Enemies.create({
      name,
      sprite: spritePath,
      movement,
      coinsDropped,
      wave,
      score,
      status,
      shotId: finalShotId,
      atributoId: finalAtributoId
    });

    return res.status(201).json({
      mensagem: 'Inimigo criado com sucesso',
      enemy: novoInimigo
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
        mensagem: 'Campos obrigatórios não definidos' 
      });
    }

    const finalShotId = (shotId && shotId !== "") ? shotId : null;
    const finalAtributoId = (atributoId && atributoId !== "") ? atributoId : null;

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
        shotId: finalShotId,
        atributoId: finalAtributoId
      },
      { where: { id } }
    );

    return res.status(200).json({ 
      mensagem: 'Inimigo alterado com sucesso!'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na alteração do inimigo' });
  }
};

// Remove um inimigo (Excluir definitivamente)
exports.remove = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ mensagem: 'ID não definido' });

    const inimigoExistente = await Enemies.findByPk(id);
    if (!inimigoExistente) return res.status(404).json({ mensagem: 'Inimigo não encontrado' });

    await Enemies.destroy({ where: { id } });
    return res.status(200).json({ mensagem: 'Inimigo excluído com sucesso' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na exclusão do inimigo' });
  }
};

// Ativa um inimigo
exports.activate = async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) return res.status(400).json({ mensagem: 'ID não definido' });
  
      await Enemies.update({ status: 'A' }, { where: { id } });
      return res.status(200).json({ mensagem: 'Inimigo ativado com sucesso!' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ mensagem: 'Erro ao ativar inimigo' });
    }
  };
  
// Desativa um inimigo
exports.deactivate = async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) return res.status(400).json({ mensagem: 'ID não definido' });
  
      await Enemies.update({ status: 'D' }, { where: { id } });
      return res.status(200).json({ mensagem: 'Inimigo desativado com sucesso!' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ mensagem: 'Erro ao desativar inimigo' });
    }
};

// Obtém um inimigo específico
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    
    const enemy = await Enemies.findByPk(id, {
      include: [
        { model: Shot, attributes: ['id', 'name', 'damage'] },
        { model: Atributo, attributes: ['id', 'speed', 'scale', 'shield'] } // <--- Corrigido aqui
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

// Obtém todos os inimigos
exports.getAll = async (req, res) => {
  try {
    const enemies = await Enemies.findAll({
      order: [['wave', 'ASC'], ['name', 'ASC']],
      include: [
        { model: Shot, attributes: ['id', 'name', 'damage'] }, // Traz o nome e dano da arma
        { model: Atributo, attributes: ['id', 'speed', 'scale', 'shield'] } // <--- CORRIGIDO: Removi 'name', adicionei os campos reais
      ],
      attributes: ['id', 'name', 'sprite', 'movement', 'coinsDropped', 'wave', 'score', 'status', 'shotId', 'atributoId']
    });

    return res.status(200).json({ 
      mensagem: 'Inimigos encontrados', 
      enemies 
    });
  } catch (err) {
    console.error("Erro detalhado no getAll Enemies:", err); // Log para ajudar se der erro de novo
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
        { model: Shot, attributes: ['id', 'name'] },
        { model: Atributo, attributes: ['id', 'speed', 'scale'] }
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