const DB_CONNECTION = require('../.env').DB_CONNECTION
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: DB_CONNECTION.HOST,
        port:DB_CONNECTION.PORT,
        user:DB_CONNECTION.USER,
        password:DB_CONNECTION.PASSWORD,
        database:DB_CONNECTION.DATABASE
    }
})

module.exports = knex