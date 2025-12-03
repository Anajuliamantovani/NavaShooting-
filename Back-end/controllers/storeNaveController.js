const StoreNave = require('../models/storeNave');

// Cria um novo registro na StoreNave (Compra/Aquisição de nave por um usuário)
exports.create = async (req, res) => {
  try {
    const { userId, naveId } = req.body;
    
    // Validação: userId e naveId são essenciais para este relacionamento
    if (!userId || !naveId) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios não definidos (userId, naveId)' });
    }

    const novoRegistro = await StoreNave.create({
      userId,
      naveId
    });

    return res.status(201).json({
      mensagem: 'Nave adicionada à loja do usuário com sucesso',
      storeNave: novoRegistro
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao registrar nave para o usuário' });
  }
};

// Atualiza um registro (Ex: transferir a posse para outro usuário ou trocar a nave do registro)
exports.update = async (req, res) => {
  try {
    const { id, userId, naveId } = req.body;
    
    if (!id) {
      return res.status(400).json({ mensagem: 'ID do registro não definido' });
    }

    const registroExistente = await StoreNave.findByPk(id);
    if (!registroExistente) {
      return res.status(404).json({ mensagem: 'Registro não encontrado' });
    }

    await StoreNave.update(
      { 
        userId, 
        naveId 
      },
      { where: { id } }
    );

    const registroAtualizado = await StoreNave.findByPk(id);

    return res.status(200).json({ 
      mensagem: 'Registro atualizado com sucesso!',
      storeNave: registroAtualizado
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na atualização do registro' });
  }
};

// Remove um registro (Ex: usuário vendeu a nave ou perdeu)
exports.remove = async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ mensagem: 'ID não definido' });
    }

    const registroExistente = await StoreNave.findByPk(id);
    if (!registroExistente) {
      return res.status(404).json({ mensagem: 'Registro não encontrado' });
    }

    await StoreNave.destroy({ where: { id } });
    return res.status(200).json({ mensagem: 'Registro excluído com sucesso' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na exclusão do registro' });
  }
};

// Obtém um registro específico (trazendo dados do User e da Nave)
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    
    const storeNave = await StoreNave.findByPk(id, {
      include: [
        { association: 'user', attributes: ['id', 'nickname', 'email'] }, // Ajuste atributos conforme seu model User
        { association: 'nave', attributes: ['id', 'name', 'sprite'] }
      ]
    });

    if (!storeNave) {
      return res.status(404).json({ mensagem: 'Registro não encontrado' });
    }

    return res.status(200).json({ 
      mensagem: 'Registro encontrado', 
      storeNave 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao buscar registro' });
  }
};

// Obtém todos os registros da StoreNave
exports.getAll = async (req, res) => {
  try {
    const registros = await StoreNave.findAll({
      order: [['id', 'ASC']],
      include: [
        { association: 'user', attributes: ['id', 'nickname'] },
        { association: 'nave', attributes: ['id', 'name'] }
      ]
    });

    return res.status(200).json({ 
      mensagem: 'Registros encontrados', 
      storeNaves: registros 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao listar registros' });
  }
};

exports.getByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const stores = await StoreNave.findAll({ where: { userId } });
        return res.status(200).json({ storeNaves: stores });
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao buscar loja do usuario' });
    }
};
/*
POST /storeNave/criar
PUT /storeNave/alterar
DELETE /storeNave/excluir
GET /storeNave/consultarUm/:id
GET /storeNave/consultarTodos
*/