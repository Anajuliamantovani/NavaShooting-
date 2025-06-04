const Sequelize = require('sequelize');
const connection = require('../database/database');

const Atributo = connection.define('atributo', 
{

    id : {
        type:Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,  
        autoIncrement: true,
    },
    speed : {
        type:Sequelize.DOUBLE,
        allowNull: true
    },
    scale : {
        type:Sequelize.DOUBLE,
        allowNull:true
    },
    maxLife : {
        type:Sequelize.DOUBLE,
        allowNull: true
    },
    shield : {
        type:Sequelize.BOOLEAN,
        allowNull: true
    }
},{
    tableName: 'atributo',   
    timestamps: false
});

Atributo.sync({ force: true });

module.exports = Atributo;