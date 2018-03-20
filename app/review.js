module.exports = function(req, res) {
  remword = function(userid, wordid) {
    connection.query("UPDATE ?? SET progress = progress + 1, daterev = ADDDATE(daterev, 2*progress) WHERE id = ?",
     [userid, wordid], function(err, rows) {
      if (err) throw err;
    });
  }
};
var mysql = require('mysql');
var dbconfig = require('../config/database');
var bcrypt = require('bcrypt-nodejs');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);
