const Sequelize = require('sequelize');

const connection = new Sequelize(
    'figurinha',
    'root',
    'tirnanog',
    {
        host: 'localhost',
        dialect: 'mysql',
        timezone: '-03:00'
    }
);

module.exports = connection;