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
        allowNull: false
    },
    scale : {
        type:Sequelize.DOUBLE,
        allowNull:false
    },
    maxLife : {
        type:Sequelize.DOUBLE,
        allowNull: false
    },
    shield : {
        type:Sequelize.BOOLEAN,
        allowNull: false
    }
},{
    tableName: 'atributo',   
    timestamps: false
});

Atributo.sync({ force: true });

module.exports = Atributo;