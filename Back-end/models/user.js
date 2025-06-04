const Sequelize = require('sequelize');
const connection = require('../database/database');

const User = connection.define('user', {

    id : {
        type:Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,  
        autoIncrement: true,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: true
    },
    nickname: {
        type: Sequelize.STRING,
        allowNull: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: true
    },
    level: {
        type:Sequelize.INTEGER,
        allowNull: true
    },
    status: {
        type: Sequelize.CHAR,
        allowNull: true
    },
    permission: {
        type: Sequelize.CHAR,
        allowNull: true
    },
    coins: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
},{
    tableName: 'users',   
    timestamps: false
});

User.sync({ force: true });

module.exports = User;