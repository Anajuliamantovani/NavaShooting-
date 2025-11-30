const StoreEnemies = require('../models/storeEnemies'); // Certifique-se que o arquivo do model exporta 'StoreEnemies'

// Cria um novo registro na StoreEnemies (Vínculo de Inimigo com Usuário)
exports.create = async (req, res) => {
  try {
    const { userId, enemiesId } = req.body;
    
    // Validação: userId e enemiesId são obrigatórios
    if (!userId || !enemiesId) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios não definidos (userId, enemiesId)' });
    }

    const novoRegistro = await StoreEnemies.create({
      userId,
      enemiesId
    });

    return res.status(201).json({
      mensagem: 'Inimigo adicionado à loja do usuário com sucesso',
      storeEnemies: novoRegistro
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao registrar inimigo para o usuário' });
  }
};

// Atualiza um registro
exports.update = async (req, res) => {
  try {
    const { id, userId, enemiesId } = req.body;
    
    if (!id) {
      return res.status(400).json({ mensagem: 'ID do registro não definido' });
    }

    const registroExistente = await StoreEnemies.findByPk(id);
    if (!registroExistente) {
      return res.status(404).json({ mensagem: 'Registro não encontrado' });
    }

    await StoreEnemies.update(
      { 
        userId, 
        enemiesId 
      },
      { where: { id } }
    );

    const registroAtualizado = await StoreEnemies.findByPk(id);

    return res.status(200).json({ 
      mensagem: 'Registro atualizado com sucesso!',
      storeEnemies: registroAtualizado
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na atualização do registro' });
  }
};

// Remove um registro
exports.remove = async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ mensagem: 'ID não definido' });
    }

    const registroExistente = await StoreEnemies.findByPk(id);
    if (!registroExistente) {
      return res.status(404).json({ mensagem: 'Registro não encontrado' });
    }

    await StoreEnemies.destroy({ where: { id } });
    return res.status(200).json({ mensagem: 'Registro excluído com sucesso' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na exclusão do registro' });
  }
};

// Obtém um registro específico
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    
    const storeEnemies = await StoreEnemies.findByPk(id, {
      include: [
        { association: 'user', attributes: ['id', 'nickname'] },
        // Nota: O alias da associação pode variar (enemy ou enemies) dependendo da sua configuração do sequelize.
        // Aqui assumo 'enemies' pois é o nome do model.
        { association: 'enemies', attributes: ['id', 'name', 'sprite', 'wave'] } 
      ]
    });

    if (!storeEnemies) {
      return res.status(404).json({ mensagem: 'Registro não encontrado' });
    }

    return res.status(200).json({ 
      mensagem: 'Registro encontrado', 
      storeEnemies 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao buscar registro' });
  }
};

// Obtém todos os registros
exports.getAll = async (req, res) => {
  try {
    const registros = await StoreEnemies.findAll({
      order: [['id', 'ASC']],
      include: [
        { association: 'user', attributes: ['id', 'nickname'] },
        { association: 'enemies', attributes: ['id', 'name', 'sprite'] }
      ]
    });

    return res.status(200).json({ 
      mensagem: 'Registros encontrados', 
      storeEnemies: registros 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao listar registros' });
  }
};

/*
POST /storeEnemies/criar
PUT /storeEnemies/alterar
DELETE /storeEnemies/excluir
GET /storeEnemies/consultarUm/:id
GET /storeEnemies/consultarTodos
*/