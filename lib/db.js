const mysql = require('mysql')

const connection = mysql.createConnection(
    {
        host : 'localhost',
        user : 'f4ray',
        database : 'corex',
        password : 'rinnegan91'
    }
);

connection.connect();
module.exports = connection;