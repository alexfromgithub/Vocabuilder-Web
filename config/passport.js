var LocalStrategy = require('passport-local').Strategy;

var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);
module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    connection.query("SELECT * FROM users WHERE id = ? ", [id], function(err, rows) {
      done(err, rows[0]);
    });
  });

  passport.use(
    'local-signup',
    new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
      },
      function(req, username, password, done) {
        // Is there a way to separate query for username and email without querying
        // the second one in "else" of the first one? Because if I do that (two
        // sepearate connection.queries and the third part is what is currently in else),
        // it seems that after running return done when a duplicate username is found,
        // the remaining code in the function continues to run, which means it will
        // continue inserting the data, which will result in an error
        connection.query("SELECT * FROM users WHERE username = ? OR email = ? ", [username, req.body.email], function(err, rows) {
          if (err)
            return done(err);
          if (rows.length) {
            return done(null, false, req.flash('signupMessage', 'That username/email is already taken.'));
          } else {
            var newUserMysql = {
              username: username,
              password: bcrypt.hashSync(password, null, null),
            };
            var insertQuery = "INSERT INTO users ( username, password, firstname, lastname, email ) values (?,?,?,?,?)";
            connection.query(insertQuery, [newUserMysql.username, newUserMysql.password, req.body.firstname, req.body.lastname, req.body.email], function(err, rows) {
              newUserMysql.id = rows.insertId;
              console.log(rows.insertId);
              var tablename = rows.insertId;
              connection.query('CREATE TABLE ?? (id INT AUTO_INCREMENT PRIMARY KEY, \
                word VARCHAR(30), pos VARCHAR(10), meaning VARCHAR(255), \
                progress TINYINT, dateadded DATE, daterev DATE, \
                UNIQUE INDEX `id_UNIQUE` (`id` ASC))', [tablename], function(err, rows) {
                if (err) throw err;
              });
              return done(null, newUserMysql);
            });
          }
        });
      })
  );

  passport.use(
    'local-login',
    new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
      },
      function(req, username, password, done) {
        connection.query("SELECT * FROM users WHERE username = ?", [username], function(err, rows) {
          if (err)
            return done(err);

          // user does not exist
          if (!rows.length) {
            return done(null, false, req.flash('loginMessage', 'The username you entered does not match any account.'));
          }

          // wrong password
          if (!bcrypt.compareSync(password, rows[0].password)) {
            return done(null, false, req.flash('loginMessage', 'The password you entered is incorrect.'));
          }

          return done(null, rows[0]);
        });
      })
  );
};
