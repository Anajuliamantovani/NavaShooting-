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
    spriteId:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    name : {
        type:Sequelize.STRING,
        allowNull:true
    },
    movement : {
        type:Sequelize.INTEGER,
        allowNull: true
    },
    coinsDropped : {
        type:Sequelize.INTEGER,
        allowNull: true
    },
    wave : {
        type:Sequelize.INTEGER,
        allowNull:true
    }
},{
    tableName: 'enemies',   
    timestamps: false
});

Enemies.belongsto(Shot);
Enemies.belongsto(Atributo);

Enemies.sync({ force: true });


module.exports = Enemies;