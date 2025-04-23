const Figurinha = require('../models/figurinha');
const Tipo = require('../models/tipo');

exports.create = (req, res, next) => {
    const codigo = req.body.codigo;
    const numero = req.body.numero;
    const nome = req.body.nome;
    const tenho = req.body.tenho;
    const especial = req.body.especial;
    const rara = req.body.rara;
    const tipoId = req.body.tipoId;

    if(codigo   === undefined || numero === undefined ||
       nome     === undefined || tenho  === undefined ||
       especial === undefined || rara   === undefined ||
       tipoId   === undefined
    )
    {
        res.status(400).json({
            mensagem: 'Campos não definidos'
        });
    }
    else
    {
        Figurinha.findOne({
            where: {
                codigo: codigo
            }
        }).then(figurinha => {
            if(figurinha == undefined)
            {
                Figurinha.create({
                    codigo   : codigo,
                    numero   : numero,
                    nome     : nome,
                    tenho    : tenho,
                    especial : especial,
                    rara     : rara,
                    tipoId   : tipoId
                }).then(figurinhaCriada => {
                    res.status(201).json({
                        mensagem: 'Figurinha criada',
                        figurinha: figurinhaCriada
                    });
                }).catch(err => {
                    console.log(err);
                    res.status(500).json({
                        mensagem: 'Erro na criacao de figurinhas'
                    });
                })
            }
            else
            {
                res.status(405).json({
                    mensagem: 'Figurinha já existe'
                });
            }
        })
    }
}

exports.update = (req, res, next) => {
    const id = req.body.id;
    const codigo = req.body.codigo;
    const numero = req.body.numero;
    const nome = req.body.nome;
    const tenho = req.body.tenho;
    const especial = req.body.especial;
    const rara = req.body.rara;
    const tipoId = req.body.tipoId;

    if(codigo   === undefined || numero === undefined ||
        nome     === undefined || tenho  === undefined ||
        especial === undefined || rara   === undefined ||
        tipoId   === undefined
     )
    {
        res.status(400).json({
            mensagem: 'Campos não definidos'
        });
    }
    else
    {
        Figurinha.update({
            codigo   : codigo,
            numero   : numero,
            nome     : nome,
            tenho    : tenho,
            especial : especial,
            rara     : rara,
            tipoId   : tipoId
        },{
            where: {
                id: id
            }
        }).then(resultado => {
            res.status(201).json({
                mensagem: 'Figurinha alterada'
            })
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                mensagem: 'Erro na alteração de Figurinhas'
            });
        })
    }
}

exports.delete = (req, res, next) => {
    const id = req.body.id;

    Figurinha.destroy({
        where: {
            id: id
        }
    }).then(() => {
        res.status(200).json({
            mensagem: 'Figurinha excluída'
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            mensagem: 'Erro na exclusão de Figurinhas'
        });
    })
}

exports.getOne = (req, res, next) => {
    const id = req.params.id;

    Figurinha.findByPk(id).then(figurinha => {
        res.status(200).json({
            mensagem: 'Figurinha encontrada',
            figurinha: figurinha
        })
    })
}

exports.getAll = (req, res, next) => {
    Figurinha.findAll({
        order: [
            ['codigo', 'ASC']
        ],
        attributes: [
            'id',
            'codigo',
            'numero',
            'nome',
            'tenho',
            'especial',
            'rara'
        ],
        include: [
            {
                model: Tipo,
                require: true,
                attributes: [
                    'id',
                    'descricao'
                ]
            }
        ]
    }).then(figurinhas => {
        res.status(200).json({
            mensagem: 'Figurinhas encontradas',
            figurinhas: figurinhas
        });
    });
}