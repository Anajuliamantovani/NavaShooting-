const Atributo = require('../models/atributo');

// Cria um novo atributo
exports.create = async (req, res) => {
  try {
    const { speed, scale, maxLife, shield } = req.body;
    
    if (speed === undefined || scale === undefined || maxLife === undefined || shield === undefined) {
      return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios (speed, scale, maxLife, shield)' });
    }

    const novoAtributo = await Atributo.create({
      speed,
      scale,
      maxLife,
      shield
    });

    return res.status(201).json({
      mensagem: 'Atributo criado com sucesso',
      atributo: {
        id: novoAtributo.id,
        speed: novoAtributo.speed,
        scale: novoAtributo.scale,
        maxLife: novoAtributo.maxLife,
        shield: novoAtributo.shield
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na criação do atributo' });
  }
};

// Atualiza dados do atributo
exports.update = async (req, res) => {
  try {
    const { id, speed, scale, maxLife, shield } = req.body;
    
    if (!id || speed === undefined || scale === undefined || maxLife === undefined || shield === undefined) {
      return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios (id, speed, scale, maxLife, shield)' });
    }

    const atributoExistente = await Atributo.findByPk(id);
    if (!atributoExistente) {
      return res.status(404).json({ mensagem: 'Atributo não encontrado' });
    }

    await Atributo.update(
      { 
        speed,
        scale,
        maxLife,
        shield
      },
      { where: { id } }
    );

    const atributoAtualizado = await Atributo.findByPk(id);

    return res.status(200).json({ 
      mensagem: 'Atributo alterado com sucesso!',
      atributo: atributoAtualizado
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na alteração do atributo' });
  }
};

// Remove um atributo
exports.remove = async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ mensagem: 'ID não definido' });
    }

    const atributoExistente = await Atributo.findByPk(id);
    if (!atributoExistente) {
      return res.status(404).json({ mensagem: 'Atributo não encontrado' });
    }

    await Atributo.destroy({ where: { id } });
    return res.status(200).json({ mensagem: 'Atributo excluído com sucesso' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na exclusão do atributo' });
  }
};

// Obtém um atributo específico
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    
    const atributo = await Atributo.findByPk(id);

    if (!atributo) {
      return res.status(404).json({ mensagem: 'Atributo não encontrado' });
    }

    return res.status(200).json({ 
      mensagem: 'Atributo encontrado', 
      atributo 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao buscar atributo' });
  }
};

// Obtém todos os atributos
exports.getAll = async (req, res) => {
  try {
    const atributos = await Atributo.findAll({
      order: [['id', 'ASC']]
    });

    return res.status(200).json({ 
      mensagem: 'Atributos encontrados', 
      atributos 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao listar atributos' });
  }
};

// Obtém atributos por faixa de velocidade
exports.getBySpeedRange = async (req, res) => {
  try {
    const { min, max } = req.params;
    
    const atributos = await Atributo.findAll({
      where: {
        speed: {
          [Sequelize.Op.between]: [parseFloat(min), parseFloat(max)]
        }
      },
      order: [['speed', 'ASC']]
    });

    if (!atributos || atributos.length === 0) {
      return res.status(404).json({ mensagem: 'Nenhum atributo encontrado nesta faixa de velocidade' });
    }

    return res.status(200).json({ 
      mensagem: 'Atributos encontrados', 
      atributos 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao buscar atributos por velocidade' });
  }
};

// Obtém atributos com shield
exports.getWithShield = async (req, res) => {
  try {
    const atributos = await Atributo.findAll({
      where: { shield: true },
      order: [['id', 'ASC']]
    });

    if (!atributos || atributos.length === 0) {
      return res.status(404).json({ mensagem: 'Nenhum atributo com shield encontrado' });
    }

    return res.status(200).json({ 
      mensagem: 'Atributos com shield encontrados', 
      atributos 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao buscar atributos com shield' });
  }
};

/*
POST /atributo/criar
PUT /atributo/alterar
GET /atributo/consultarUm/:id
GET /atributo/consultarTodos
DELETE /atributo/excluir
GET /atributo/porVelocidade/:min/:max
GET /atributo/comShield
*/