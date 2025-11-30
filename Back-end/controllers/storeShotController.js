const StoreShot = require('../models/storeShot');

// Cria um novo registro na StoreShot (Compra/Aquisição de shot por um usuário)
exports.create = async (req, res) => {
  try {
    const { userId, shotId } = req.body;
    
    // Validação: userId e shotId são obrigatórios para vincular a posse
    if (!userId || !shotId) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios não definidos (userId, shotId)' });
    }

    const novoRegistro = await StoreShot.create({
      userId,
      shotId
    });

    return res.status(201).json({
      mensagem: 'Shot adicionado à loja do usuário com sucesso',
      storeShot: novoRegistro
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao registrar shot para o usuário' });
  }
};

// Atualiza um registro (Trocar o dono ou o item)
exports.update = async (req, res) => {
  try {
    const { id, userId, shotId } = req.body;
    
    if (!id) {
      return res.status(400).json({ mensagem: 'ID do registro não definido' });
    }

    const registroExistente = await StoreShot.findByPk(id);
    if (!registroExistente) {
      return res.status(404).json({ mensagem: 'Registro não encontrado' });
    }

    await StoreShot.update(
      { 
        userId, 
        shotId 
      },
      { where: { id } }
    );

    const registroAtualizado = await StoreShot.findByPk(id);

    return res.status(200).json({ 
      mensagem: 'Registro atualizado com sucesso!',
      storeShot: registroAtualizado
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na atualização do registro' });
  }
};

// Remove um registro (Usuário perdeu ou vendeu o shot)
exports.remove = async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ mensagem: 'ID não definido' });
    }

    const registroExistente = await StoreShot.findByPk(id);
    if (!registroExistente) {
      return res.status(404).json({ mensagem: 'Registro não encontrado' });
    }

    await StoreShot.destroy({ where: { id } });
    return res.status(200).json({ mensagem: 'Registro excluído com sucesso' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na exclusão do registro' });
  }
};

// Obtém um registro específico com os dados do Usuário e do Shot
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    
    const storeShot = await StoreShot.findByPk(id, {
      include: [
        { association: 'user', attributes: ['id', 'nickname', 'email'] },
        { association: 'shot', attributes: ['id', 'name', 'sprite', 'damage'] }
      ]
    });

    if (!storeShot) {
      return res.status(404).json({ mensagem: 'Registro não encontrado' });
    }

    return res.status(200).json({ 
      mensagem: 'Registro encontrado', 
      storeShot 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao buscar registro' });
  }
};

// Obtém todos os registros da StoreShot
exports.getAll = async (req, res) => {
  try {
    const registros = await StoreShot.findAll({
      order: [['id', 'ASC']],
      include: [
        { association: 'user', attributes: ['id', 'nickname'] },
        { association: 'shot', attributes: ['id', 'name', 'sprite'] }
      ]
    });

    return res.status(200).json({ 
      mensagem: 'Registros encontrados', 
      storeShots: registros 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao listar registros' });
  }
};

/*
POST /storeShot/criar
PUT /storeShot/alterar
DELETE /storeShot/excluir
GET /storeShot/consultarUm/:id
GET /storeShot/consultarTodos
*/