const Sequelize = require('sequelize');
const connection = require('../database/database');
const User = require('./user');
const Shot = require('./shot');
const Nave = require('./nave');

const Bag = connection.define('bag', 
{

    id : {
        type:Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,  
        autoIncrement: true,
    }
},{
    tableName: 'bag',   
    timestamps: false
});

Bag.belongsTo(User);
Bag.belongsTo(Shot);
Bag.belongsTo(Nave);
//Bag.sync({ force: true });

module.exports = Bag;