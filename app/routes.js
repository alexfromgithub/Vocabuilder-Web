module.exports = function(app, passport) {
  app.get('/', function(req, res) {
    if (req.isAuthenticated()) {
      res.redirect('/home');
    }
    res.redirect('/welcome');
  });

  app.get('/welcome', function(req, res) {
    res.render('welcome', {
      message: req.flash('loginMessage'),
      title: "Welcome to Vocabuilder"
    });
  });

  app.get('/signup', function(req, res) {
    res.render('signup', {
      message: req.flash('signupMessage'),
      title: "Sign Up"
    });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/welcome',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  app.post('/login', passport.authenticate('local-login', {
      successRedirect: 'home',
      failureRedirect: '/welcome',
      failureFlash: true
    }),
    function(req, res) {
      if (req.body.remember) {
        req.session.cookie.maxAge = 1000 * 60 * 3;
      } else {
        req.session.cookie.expires = false;
      }
      res.redirect('/');
    });

  app.get('/home', isLoggedIn, function(req, res) {
    res.render('home', {
      title: 'Home',
      user: req.user
    });
  });

  app.get('/profile', function(req, res) {
    if (req.isAuthenticated()){
      res.render('profile', {
        title: 'Profile',
        message: req.flash('message'),
        user: req.user
      });
    }
    else {
      res.redirect('/');
    }
  });

  app.post('/changename', function(req, res) {
    changeName(req.user.id, req.body.firstname, req.body.lastname);
    res.redirect('profile');
  });

  app.post('/changeemail', function(req, res) {
    changeEmail(req.user.id, req.body.email);
    res.redirect('profile');
  });

  app.post('/changepw', function(req, res, next) {
    connection.query("SELECT * FROM users WHERE id = ?", [req.user.id], function(err, rows) {
      if (err) throw err;
      if (req.body.oldpw !== rows[0].password) {
        console.log("dd");
        req.flash('message', 'Sorry. Your old password is incorrect.');
        res.redirect('profile');
      }
    });
    // res.redirect('profile');
  });

  app.get('/word-list', function(req, res) {
    // if (req.isAuthenticated()){
      res.render('word-list', {
        title: 'Word List',
        user: req.user
      });
    // }
    // else {
    //   res.redirect('/');
    // }

  });
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};

var mysql = require('mysql');
var dbconfig = require('../config/database');
var bcrypt = require('bcrypt-nodejs');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

function changeName(id, firstname, lastname) {
  connection.query("UPDATE users SET firstname = ?, lastname = ? WHERE id = ?",
    [firstname,lastname,id], function(err, rows){
    if (err) throw err;
  });
}

function changeEmail(id, email) {
  connection.query("UPDATE users SET email = ? WHERE id = ?",
    [email,id], function(err, rows){
    if (err) throw err;
  });
}

function changePW(id, oldpw, newpw, newpw2, done, req) {

}
