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
    score: {
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
    // NOVO CAMPO: Foto de Perfil
    profilePic: {
        type: Sequelize.STRING,
        allowNull: true // Pode ser nulo (usuário sem foto)
    }
},{
    tableName: 'users',   
    timestamps: false
});


module.exports = User;