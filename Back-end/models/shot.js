const Sequelize = require('sequelize');
const connection = require('../database/database');

const Shot = connection.define('shot', {

    id : {
        type:Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,  
        autoIncrement: true,
    },
    sprite: {
        type: Sequelize.STRING,
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
    damage: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    status: {
            type: Sequelize.CHAR,
            allowNull: false
    }
},{
    tableName: 'shot',   
    timestamps: false
});

//Shot.sync({ force: true });

module.exports = Shot;