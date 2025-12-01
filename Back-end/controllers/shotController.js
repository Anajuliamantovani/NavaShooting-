const Shot = require('../models/shot');

// Cria um novo shot
exports.create = async (req, res) => {
  try {
    const { price, name, damage, status } = req.body;
    
    // Tratamento da Imagem (Vem do Multer)
    let spritePath = null;
    if (req.file) {
        spritePath = req.file.filename; 
    }

    // Validação: Sprite e Status são obrigatórios
    if (!spritePath || !status) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios: sprite (imagem) e status' });
    }

    const novoShot = await Shot.create({
      sprite: spritePath, // Salva o nome do arquivo gerado
      price: price || 0,
      name: name || 'Sem Nome',
      damage: damage || 0,
      status
    });

    return res.status(201).json({
      mensagem: 'Shot criado com sucesso',
      shot: novoShot
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na criação do shot' });
  }
};

// Atualiza dados do shot
exports.update = async (req, res) => {
  try {
    const { id, sprite, price, name, damage, status } = req.body;
    
    if (!id || !sprite || !status) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios não definidos (id, sprite, status)' });
    }

    const shotExistente = await Shot.findByPk(id);
    if (!shotExistente) {
      return res.status(404).json({ mensagem: 'Shot não encontrado' });
    }

    await Shot.update(
      { 
        sprite, 
        price, 
        name, 
        damage, 
        status 
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
      attributes: ['id', 'sprite', 'price', 'name', 'damage', 'status']
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
      attributes: ['id', 'sprite', 'price', 'name', 'damage', 'status']
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

/*
POST /shot/criar
PUT /shot/alterar
GET /shot/consultarUm/:id
GET /shot/consultarTodos
DELETE /shot/excluir
POST /shot/ativar
POST /shot/desativar
*/