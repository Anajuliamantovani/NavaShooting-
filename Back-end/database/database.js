const Sequelize = require('sequelize');

const connection = new Sequelize(
    'Navashooting',
    'root',
    'Mantovan!555',
    {
        host: 'localhost',
        dialect: 'mysql',
        timezone: '-03:00'
    }
);

module.exports = connection;