var mysql = require('mysql');
var config = require('../../config.js').database;

var pool = mysql.createPool({
  connectionLimit : 16,
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  multipleStatements: true
});

exports.query = pool.query.bind(pool);