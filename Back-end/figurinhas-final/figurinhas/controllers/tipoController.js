const Tipo = require('../models/tipo');

exports.create = (req, res, next) => {
    const descricao = req.body.descricao;

    if(descricao === undefined)
    {
        res.status(400).json({
            mensagem: 'Campos não definidos'
        });
    }
    else
    {
        Tipo.findOne({
            where: {
                descricao: descricao
            }
        }).then(tipo => {
            if(tipo == undefined)
            {
                Tipo.create({
                    descricao: descricao
                }).then(tipoCriado => {
                    res.status(201).json({
                        mensagem: 'Tipo criado',
                        tipo: {
                            id: tipoCriado.id,
                            descricao: tipoCriado.descricao
                        }
                    });
                }).catch(err => {
                    console.log(err);
                    res.status(500).json({
                        mensagem: 'Erro na criacao de tipos'
                    });
                })
            }
            else
            {
                res.status(405).json({
                    mensagem: 'Tipo já existe'
                });
            }
        })
    }
}

exports.update = (req, res, next) => {
    const id = req.body.id;
    const descricao = req.body.descricao;

    if(id === undefined || descricao === undefined)
    {
        res.status(400).json({
            mensagem: 'Campos não definidos'
        });
    }
    else
    {
        Tipo.update({
            descricao: descricao
        },{
            where: {
                id: id
            }
        }).then(resultado => {
            res.status(201).json({
                mensagem: 'Tipo alterado'
            })
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                mensagem: 'Erro na alteração de Tipos'
            });
        })
    }
}

exports.delete = (req, res, next) => {
    const id = req.body.id;

    Tipo.destroy({
        where: {
            id: id
        }
    }).then(() => {
        res.status(200).json({
            mensagem: 'Tipo excluído'
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            mensagem: 'Erro na exclusão de Tipos'
        });
    })
}

exports.getOne = (req, res, next) => {
    const id = req.params.id;

    Tipo.findOne({
        where: {
            id: id
        },
        attributes: [
            'id',
            'descricao'
        ]
    }).then(tipo => {
        res.status(200).json({
            mensagem: 'Tipo encontrado',
            tipo: tipo
        })
    })
}

exports.getAll = (req, res, next) => {
    Tipo.findAll({
        order: [
            ['descricao', 'ASC']
        ],
        attributes: [
            'id',
            'descricao'
        ]
    }).then(tipos => {
        res.status(200).json({
            mensagem: 'Tipos encontrados',
            tipos: tipos
        });
    });
}