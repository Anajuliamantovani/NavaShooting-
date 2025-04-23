const Sequelize = require('sequelize');
const connection = require('../database/database');

const User = connection.define('user', {

    id : {
        type:Sequelize.INTEGER,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    nickname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    level: {
        type:Sequelize.INTEGER,
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
});

//Usuario.sync({force: true});

module.exports = User;