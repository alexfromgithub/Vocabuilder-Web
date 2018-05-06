module.exports = function(req, res) {
  addWord = function(userid, word, pos, meaning) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate()+1);
    dd = tomorrow.getDate();
    mm = tomorrow.getMonth()+1;
    yyyy = tomorrow.getFullYear();
    tomorrow = yyyy + '-' + mm + '-' + dd;
    // review date is set to today for testing purpose
    connection.query("INSERT INTO ?? ( word, pos, meaning, progress, dateadded, daterev ) values (?,?,?,?,?,?)",
     [userid, word, pos, meaning, 0, today, today], function(err, rows) {
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

  editWord = function(userid, wordid, word, pos, meaning) {
    connection.query("UPDATE ?? SET word = ?, pos = ?, meaning = ? WHERE id = ?",
     [userid, word, pos, meaning, wordid], function(err, rows){
      if (err) throw err;
    });
  }

  deleteWord = function(userid, wordid) {
    connection.query("DELETE FROM ?? WHERE id = ?", [userid, wordid], function(err, rows){
      if (err) throw err;
    });
  }

  getRevWordList = function(userid, callback) {
    connection.query("SELECT * FROM ?? WHERE DATE_FORMAT(daterev, '%Y-%m-%d') <= CURDATE() \
     and progress < 10",
     [userid], function(err, rows){
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
