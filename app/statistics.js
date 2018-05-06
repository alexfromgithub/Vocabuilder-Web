module.exports = function(req, res) {
  numWordsToday = function(userid, callback) {
    connection.query("SELECT * FROM ?? WHERE DATE_FORMAT(dateadded, '%Y-%m-%d') = CURDATE()",
     [userid], function(err, rows){
       if (err) throw err;
       return callback(null, rows.length);
     });
  }
  numWordsProg = function(userid, callback) {
      connection.query("SELECT COUNT(PROGRESS), PROGRESS FROM ?? GROUP BY progress", [userid],
      function(err, rows) {
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
