/*
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/user');
const utils = require('../utils/utils');
const User = require('../models/user');

exports.create = (req, res, next) => {
    const nickname = req.body.nickname;
    const email = req.body.email;
    const password = req.body.password;

    if(nickname === undefined || email === undefined || password === undefined)
    {
        res.status(400).json({
            mensagem: 'Campos não definidos'
        });
    }
    else
    {
        bcrypt.hash(senha, 10).then(senhaCriptografada => {
            User.findOne({
                where: {
                    email: email
                }
            }).then(usuario => {
                if(usuario == undefined)
                {
                    Usuario.create({
                        nickname: nickname,
                        email: email,
                        password: senhaCriptografada,
                        status: 'A',
                        permission: 'User',

                    }).then(usuarioCriado => {
                        res.status(201).json({
                            mensagem: 'Usuário criado',
                            usuario: {
                                id: usuarioCriado.id,
                                nickname: usuarioCriado.nickname,
                                email: usuarioCriado.email
                            }
                        });
                    }).catch(err => {
                        console.log(err);
                        res.status(500).json({
                            mensagem: 'Erro na criacao de usuarios'
                        });
                    })
                }
                else
                {
                    res.status(405).json({
                        mensagem: 'Usuário já existe'
                    });
                }
            })
        })
    }
}

exports.update = (req, res, next) => {
    const id = req.body.id;
    const email = req.body.email;
    const nickname = req.body.nickname;
    const password = req.body.password;

    if(id === undefined || email === undefined || nickname === undefined || password === undefined)
    {
        res.status(400).json({
            mensagem: 'Campos não definidos'
        });
    }
    else
    {
        Usuario.update({
            email: email,
            nickname: nickname,
            password: password
        },{
            where: {
                id: id
            }
        }).then(resultado => {
            res.status(201).json({
                mensagem: 'Informações alteradas com sucesso !'
            })
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                mensagem: 'Erro na alteração das informações'
            });
        })
    }
}

exports.delete = (req, res, next) => {
    const id = req.body.id;

    User.destroy({
        where: {
            id: id
        }
    }).then(() => {
        res.status(200).json({
            mensagem: 'Usuario excluído'
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            mensagem: 'Erro na exclusão de usuarios'
        });
    })
}

exports.getOne = (req, res, next) => {
    const id = req.params.id;

    User.findOne({
        where: {
            id: id
        },
        attributes: [
            'id',
            'nickname',
            'email',
            'level',
            'coins',
        ]
    }).then(usuario => {
        res.status(200).json({
            mensagem: 'usuario encontrado',
            usuario: usuario
        })
    })
}

exports.getAll = (req, res, next) => {
    Usuario.findAll({
        order: [
            ['nome', 'ASC']
        ],
        attributes: [
            'id',
            'email',
            'nome'
        ]
    }).then(usuarios => {
        res.status(200).json({
            mensagem: 'Usuários encontrados',
            usuarios: usuarios
        });
    });
}

exports.login = (req, res, next) => {
    const JWT_KEY = utils.JWT_KEY;
    const password = req.body.password;
    const nickname = req.body.nickname;

    let erro = false;
    let usuarioEncontrado;

    Usuario.findOne({
        where: {
            nickname: nickname
        }
    }).then(User => {
        if(!User)
        {
            erro = true;
            return res.status(401).json({
                mensagem: 'Credenciais inválidas'
            });
        }
        else
        {
            usuarioEncontrado = User;
            return bcrypt.compare(password, User.password);
        }
    }).then(resultado => {
        if(!erro)
        {
            if(!resultado)
            {
                return res.status(401).json({
                    mensagem: 'Credenciais inválidas'
                });
            }
            const token = jwt.sign({
                nickname: usuarioEncontrado.nickname
                },
                JWT_KEY,
                {
                    expiresIn: '1h'
                }
            );
            res.status(200).json({
                token: token,
                expiresIn: '3600',
                usarioId: usuarioEncontrado.id
            });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            mensagem: 'Erro na criacao de usuarios'
        });
    })
}
controllers/userController.js
*/


  //IA 


// controllers/userController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const utils = require('../utils/utils');

// Cria um usuário novo
exports.create = async (req, res) => {
  try {
    const { nickname, email, password } = req.body;
    if (!nickname || !email || !password) {
      return res.status(400).json({ mensagem: 'Campos não definidos' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(409).json({ mensagem: 'Usuário já existe' });
    }

    const novo = await User.create({
      nickname,
      email,
      password: hashed,
      status: 'A',
      permission: 'User'
    });

    return res.status(201).json({
      mensagem: 'Usuário criado',
      usuario: {
        id: novo.id,
        nickname: novo.nickname,
        email: novo.email
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na criação de usuários' });
  }
};

// Atualiza dados do usuário
exports.update = async (req, res) => {
  try {
    const { id, email, nickname, password } = req.body;
    if (!id || !email || !nickname || !password) {
      return res.status(400).json({ mensagem: 'Campos não definidos' });
    }
    const hashed = await bcrypt.hash(password, 10);
    await User.update(
      { email, nickname, password: hashed },
      { where: { id } }
    );
    return res.status(200).json({ mensagem: 'Informações alteradas com sucesso!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na alteração das informações' });
  }
};

// Remove usuário
exports.remove = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ mensagem: 'ID não definido' });
    }
    await User.destroy({ where: { id } });
    return res.status(200).json({ mensagem: 'Usuário excluído' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro na exclusão de usuários' });
  }
};

// Obtém um usuário
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await User.findOne({
      where: { id },
      attributes: ['id', 'nickname', 'email', 'level', 'coins']
    });
    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }
    return res.status(200).json({ mensagem: 'Usuário encontrado', usuario });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao buscar usuário' });
  }
};

// Obtém todos os usuários
exports.getAll = async (req, res) => {
  try {
    const usuarios = await User.findAll({
      order: [['nickname', 'ASC']],
      attributes: ['id', 'email', 'nickname']
    });
    return res.status(200).json({ mensagem: 'Usuários encontrados', usuarios });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao listar usuários' });
  }
};

// Altera senha (rota POST /password)
exports.password = async (req, res) => {
  try {
    const { id, newPassword } = req.body;
    if (!id || !newPassword) {
      return res.status(400).json({ mensagem: 'Campos não definidos' });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashed }, { where: { id } });
    return res.status(200).json({ mensagem: 'Senha alterada com sucesso!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro ao alterar senha' });
  }
};

// Login e emissão de token
exports.login = async (req, res) => {
  try {
    const { nickname, password } = req.body;
    if (!nickname || !password) {
      return res.status(400).json({ mensagem: 'Campos não definidos' });
    }

    const usuario = await User.findOne({ where: { nickname } });
    if (!usuario) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    const match = await bcrypt.compare(password, usuario.password);
    if (!match) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ nickname: usuario.nickname }, utils.JWT_KEY, {
      expiresIn: '1h'
    });

    return res.status(200).json({
      token,
      expiresIn: 3600,
      userId: usuario.id
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro no login de usuários' });
  }
};

