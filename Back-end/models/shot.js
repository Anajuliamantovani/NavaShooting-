const Sequelize = require('sequelize');
const connection = require('../database/database');

const Shot = connection.define('shot', {

    id : {
        type:Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,  
        autoIncrement: true,
    },
    color: {
        type: Sequelize.STRING,
        allowNull: false
    },
    sprite: {
        type: Sequelize.BLOB,
        allowNull: false
    },
    price: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    name: {
        type:Sequelize.STRING,
        allowNull: true
    },
    status: {
        type: Sequelize.CHAR,
        allowNull: false
    },
    permission: {
        type: Sequelize.CHAR,
        allowNull: false
    },
    coins: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
},{
    tableName: 'shot',   
    timestamps: false
});

//Shot.sync({ force: true });

module.exports = Shot;