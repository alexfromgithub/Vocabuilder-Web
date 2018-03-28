module.exports = function(req, res) {
  searchword = function(word, callback) {
    connection.query("SELECT * FROM dictionary WHERE word = ?", [word], function(err, rows) {
      if (err) throw err;
      return callback(null, rows);
    });
  }
};
var mysql = require('mysql');
var dbconfig = require('../config/database');
var bcrypt = require('bcrypt-nodejs');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);
