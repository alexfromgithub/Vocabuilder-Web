module.exports = function(req, res) {
  changeName = function(id, firstname, lastname) {
    connection.query("UPDATE users SET firstname = ?, lastname = ? WHERE id = ?", [firstname, lastname, id], function(err, rows) {
      if (err) throw err;
    });
  }

  changeEmail = function(id, email) {
    connection.query("UPDATE users SET email = ? WHERE id = ?", [email, id], function(err, rows) {
      if (err) throw err;
    });
  }
};
var mysql = require('mysql');
var dbconfig = require('../config/database');
var bcrypt = require('bcrypt-nodejs');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);