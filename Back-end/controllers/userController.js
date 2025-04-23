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
