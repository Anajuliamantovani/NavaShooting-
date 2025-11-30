const Sequelize = require('sequelize');
const connection = require('../database/database');
const User = require('./user');
const Nave = require('./nave');

const StoreNave = connection.define('storeNave', 
{

    id : {
        type:Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,  
        autoIncrement: true,
    }
},{
    tableName: 'storeNave',   
    timestamps: false
});

StoreNave.belongsTo(User);
StoreNave.belongsTo(Nave);

//StoreNave.sync({ force: true });

module.exports = StoreNave;