const database = require('./../config/database');

const USER = encodeURIComponent(database.dbUser);
const PASSWORD = encodeURIComponent(database.dbPassword);
const URI = `postgres://${USER}:${PASSWORD}@${database.dbHost}:${database.dbPort}/${database.dbName}`;
console.log(URI);
module.exports = {
    development: {
        url: URI,
        dialect: 'postgres',
    },
    production: {
        url: URI,
        dialect: 'postgres',
    }
}