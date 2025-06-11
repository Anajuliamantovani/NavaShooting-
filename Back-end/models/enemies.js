const Sequelize = require('sequelize');
const connection = require('../database/database');
const Shot = require('./shot');
const Atributo = require('./atributo');

const Enemies = connection.define('enemies', 
{

    id : {
        type:Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,  
        autoIncrement: true,
    },
    spriteId : {
        type:Sequelize.INTEGER,
        allowNull: false
    },
    name : {
        type:Sequelize.STRING,
        allowNull:false
    },
    movement : {
        type:Sequelize.INTEGER,
        allowNull: false
    },
    coinsDropped : {
        type:Sequelize.INTEGER,
        allowNull: false
    },
    wave : {
        type:Sequelize.INTEGER,
        allowNull:false
    }
},{
    tableName: 'enemies',   
    timestamps: false
});

Enemies.belongsTo(Shot);
Enemies.belongsTo(Atributo);

//Enemies.sync({ force: true });


module.exports = Enemies;