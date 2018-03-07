module.exports = function(req, res) {
  addWord = function(userid, word, phonetic, meaning) {
    connection.query("SELECT 1+1", function(err, rows) {
      console.log(rows);
      if (err) throw err;
    });
  }
};
var mysql = require('mysql');
var dbconfig = require('../config/database');
var bcrypt = require('bcrypt-nodejs');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);
