const Sequelize = require('sequelize');
const connection = require('../database/database');
const User = require('./user');
const Enemies = require('./enemies');

const StoreEnemies = connection.define('storeEnemies', 
{

    id : {
        type:Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,  
        autoIncrement: true,
    }
},{
    tableName: 'StoreEnemies',   
    timestamps: false
});

StoreEnemies.belongsTo(User);
StoreEnemies.belongsTo(Enemies);
StoreEnemies.sync({ force: true });

module.exports = StoreEnemies;