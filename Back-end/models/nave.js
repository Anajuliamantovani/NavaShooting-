const Sequelize = require('sequelize');
const connection = require('../database/database');
const Shot = require('./shot');
const PowerUp = require('./powerUp');
const Atributo = require('./atributo');

const Nave = connection.define('nave', 
{

    id : {
        type:Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,  
        autoIncrement: true,
    },
    spriteId:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    name: {
        type:Sequelize.STRING,
        allowNull: true
    },
    price:{
        type:Sequelize.INTEGER,
        allowNull:true
    }
},{
    tableName: 'nave',   
    timestamps: false
});

Nave.belongsTo(PowerUp)
Nave.belongsTo(Shot);
Nave.belongsTo(Atributo);

//Nave.sync({ force: true });

module.exports = Nave;