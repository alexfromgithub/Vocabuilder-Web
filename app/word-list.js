module.exports = function(req, res) {
  addWord = function(userid, word, phonetic, meaning) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    connection.query("INSERT INTO ?? ( word, phonetic, meaning, progress, dateadded ) values (?,?,?,?,?)",
     [userid, word, phonetic, meaning, 0, today], function(err, rows) {
      if (err) throw err;
    });
  }

  getWordList = function(userid, callback) {
    connection.query("SELECT * FROM ??", [userid], function(err, rows){
      if (err) throw err;
      else {
        return callback(null, rows);
      }
    });
  }

  editWord = function(userid, wordid, word, phonetic, meaning) {
    connection.query("UPDATE ?? SET word = ?, phonetic = ?, meaning = ? WHERE id = ?",
     [userid, word, phonetic, meaning, wordid], function(err, rows){
      if (err) throw err;
    });
  }
};
var mysql = require('mysql');
var dbconfig = require('../config/database');
var bcrypt = require('bcrypt-nodejs');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);
