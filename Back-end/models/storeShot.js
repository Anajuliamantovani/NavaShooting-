const Sequelize = require('sequelize');
const connection = require('../database/database');
const User = require('./user');
const Shot = require('./shot');

const StoreShot = connection.define('storeShot', 
{

    id : {
        type:Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,  
        autoIncrement: true,
    }
},{
    tableName: 'storeShot',   
    timestamps: false
});

StoreShot.belongsTo(User);
StoreShot.belongsTo(Shot);

//StoreShot.sync({ force: true });

module.exports = StoreShot;