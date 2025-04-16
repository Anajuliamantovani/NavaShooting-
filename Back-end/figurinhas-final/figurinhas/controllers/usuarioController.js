const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');
const utils = require('../utils/utils');

exports.create = (req, res, next) => {
    const nome = req.body.nome;
    const email = req.body.email;
    const senha = req.body.senha;

    if(nome === undefined || email === undefined || senha === undefined)
    {
        res.status(400).json({
            mensagem: 'Campos não definidos'
        });
    }
    else
    {
        bcrypt.hash(senha, 10).then(senhaCriptografada => {
            Usuario.findOne({
                where: {
                    email: email
                }
            }).then(usuario => {
                if(usuario == undefined)
                {
                    Usuario.create({
                        nome: nome,
                        email: email,
                        senha: senhaCriptografada
                    }).then(usuarioCriado => {
                        res.status(201).json({
                            mensagem: 'Usuário criado',
                            usuario: {
                                id: usuarioCriado.id,
                                nome: usuarioCriado.nome,
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
    const nome = req.body.nome;

    if(id === undefined || email === undefined || nome === undefined)
    {
        res.status(400).json({
            mensagem: 'Campos não definidos'
        });
    }
    else
    {
        Usuario.update({
            email: email,
            nome: nome
        },{
            where: {
                id: id
            }
        }).then(resultado => {
            res.status(201).json({
                mensagem: 'Usuario alterado'
            })
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                mensagem: 'Erro na alteração de usuario'
            });
        })
    }
}

exports.delete = (req, res, next) => {
    const id = req.body.id;

    Usuario.destroy({
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

    Usuario.findOne({
        where: {
            id: id
        },
        attributes: [
            'id',
            'nome',
            'email'
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
    const senha = req.body.senha;
    const email = req.body.email;

    let erro = false;
    let usuarioEncontrado;

    Usuario.findOne({
        where: {
            email: email
        }
    }).then(usuario => {
        if(!usuario)
        {
            erro = true;
            return res.status(401).json({
                mensagem: 'Credenciais inválidas'
            });
        }
        else
        {
            usuarioEncontrado = usuario;
            return bcrypt.compare(senha, usuario.senha);
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
                email: usuarioEncontrado.email
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

exports.password = (req, res, next) => {
    const senha = req.body.password;
    const id = req.body.id;

    if(senha === undefined || id == undefined)
    {
        res.status(400).json({
            mensagem: 'Campos não definidos'
        });
    }
    else
    {
        bcrypt.hash(senha, 10).then(senhaCriptografada => {
            Usuario.update({
                senha: senhaCriptografada
            },{
                where: {
                    id: id
                }
            }).then(resultado => {
                res.status(201).json({
                    mensagem: 'Senha alterada'
                });
            });
        });
    }
}
