const Shot = require('../models/shot');

// Cria um novo shot
exports.create = async (req, res) => {
  try {
    const { color, sprite, price, name, status, permission, coins } = req.body;
    
    if (!color || !sprite || !status || !permission) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios não definidos (color, sprite, status, permission)' });
    }

    const novoShot = await Shot.create({
      color,
      sprite,
      price: price || null,
      name: name || null,
      status,
      permission,
      coins: coins || null
    });

    return res.status(201).json({
      mensagem: 'Shot criado com sucesso',
      shot: {
        id: novoShot.id,
        color: novoShot.color,
        sprite: novoShot.sprite,
        price: novoShot.price,
        name: novoShot.name,
        status: novoShot.status,
        permission: novoShot.permission,
        coins: novoShot.coins
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na criação do shot' });
  }
};

// Atualiza dados do shot
exports.update = async (req, res) => {
  try {
    const { id, color, sprite, price, name, status, permission, coins } = req.body;
    
    if (!id || !color || !sprite || !status || !permission) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios não definidos (id, color, sprite, status, permission)' });
    }

    const shotExistente = await Shot.findByPk(id);
    if (!shotExistente) {
      return res.status(404).json({ mensagem: 'Shot não encontrado' });
    }

    await Shot.update(
      { 
        color, 
        sprite, 
        price, 
        name, 
        status, 
        permission, 
        coins 
      },
      { where: { id } }
    );

    const shotAtualizado = await Shot.findByPk(id);

    return res.status(200).json({ 
      mensagem: 'Shot alterado com sucesso!',
      shot: shotAtualizado
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na alteração do shot' });
  }
};

// Remove um shot
exports.remove = async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ mensagem: 'ID não definido' });
    }

    const shotExistente = await Shot.findByPk(id);
    if (!shotExistente) {
      return res.status(404).json({ mensagem: 'Shot não encontrado' });
    }

    await Shot.destroy({ where: { id } });
    return res.status(200).json({ mensagem: 'Shot excluído com sucesso' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na exclusão do shot' });
  }
};

// Obtém um shot específico
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    
    const shot = await Shot.findByPk(id, {
      attributes: ['id', 'color', 'sprite', 'price', 'name', 'status', 'permission', 'coins']
    });

    if (!shot) {
      return res.status(404).json({ mensagem: 'Shot não encontrado' });
    }

    return res.status(200).json({ 
      mensagem: 'Shot encontrado', 
      shot 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao buscar shot' });
  }
};

// Obtém todos os shots
exports.getAll = async (req, res) => {
  try {
    const shots = await Shot.findAll({
      order: [['name', 'ASC']],
      attributes: ['id', 'color', 'sprite', 'price', 'name', 'status', 'permission', 'coins']
    });

    return res.status(200).json({ 
      mensagem: 'Shots encontrados', 
      shots 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao listar shots' });
  }
};

// Ativa um shot (altera status para 'A')
exports.activate = async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ mensagem: 'ID não definido' });
    }

    const shotExistente = await Shot.findByPk(id);
    if (!shotExistente) {
      return res.status(404).json({ mensagem: 'Shot não encontrado' });
    }

    await Shot.update(
      { status: 'A' },
      { where: { id } }
    );

    return res.status(200).json({ mensagem: 'Shot ativado com sucesso!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao ativar shot' });
  }
};

// Desativa um shot (altera status para 'D')
exports.deactivate = async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ mensagem: 'ID não definido' });
    }

    const shotExistente = await Shot.findByPk(id);
    if (!shotExistente) {
      return res.status(404).json({ mensagem: 'Shot não encontrado' });
    }

    await Shot.update(
      { status: 'D' },
      { where: { id } }
    );

    return res.status(200).json({ mensagem: 'Shot desativado com sucesso!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao desativar shot' });
  }
};

// Obtém shots por permissão
exports.getByPermission = async (req, res) => {
  try {
    const { permission } = req.params;
    
    const shots = await Shot.findAll({
      where: { permission },
      order: [['name', 'ASC']],
      attributes: ['id', 'color', 'sprite', 'price', 'name', 'status', 'coins']
    });

    if (!shots || shots.length === 0) {
      return res.status(404).json({ mensagem: 'Nenhum shot encontrado com esta permissão' });
    }

    return res.status(200).json({ 
      mensagem: 'Shots encontrados', 
      shots 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao buscar shots por permissão' });
  }
};

/*
POST /shot/criar
PUT /shot/alterar
GET /shot/consultarUm/:id
GET /shot/consultarTodos
DELETE /shot/excluir
POST /shot/ativar
POST /shot/desativar
GET /shot/porPermissao/:permission
*/