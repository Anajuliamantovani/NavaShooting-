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
    sprite:{
        type:Sequelize.STRING,
        allowNull:true
    },
    name: {
        type:Sequelize.STRING,
        allowNull: true
    },
    price:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    masLife:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    status: {
        type: Sequelize.CHAR,
        allowNull: false
    }
},{
    tableName: 'nave',   
    timestamps: false
});

//Nave.sync({ force: true });

module.exports = Nave;