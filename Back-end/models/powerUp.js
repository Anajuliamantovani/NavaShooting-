const Sequelize = require('sequelize');
const connection = require('../database/database');
const Shot = require('./shot');
const Atributo = require('./atributo');


const PowerUp = connection.define('powerUp', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primarykey: true,
        autoincrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    sprite: {
        type: Sequelize.BLOB,
        allowNull: false
    }
},{
    tableName: 'powerUp',   
    timestamps: false
});


PowerUp.belongsTo(Shot);
PowerUp.belongsTo(Atributo);


PowerUp.sync({force: true});

module.exports = PowerUp;