const Sequelize = require('sequelize');
const connection = require('../database/database');

const Tipo = connection.define('tipos', {
    descricao: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

//Tipo.sync({force: true});

module.exports = Tipo;