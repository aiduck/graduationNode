
const mysql = require('mysql');

// 连接数据库
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'demo',
    port: 3306
    
});

module.exports = pool