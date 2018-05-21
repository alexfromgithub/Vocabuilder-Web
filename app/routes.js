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

  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile', {
      title: 'Profile',
      messageSuccess: req.flash('messageSuccess'),
      messageFail: req.flash('messageFail'),
      user: req.user
    });
  });

  app.post('/changename', function(req, res) {
    if (req.user.username === 'demo') {
      req.flash('messageFail', 'Sorry. You are using a demo account so you cannot \
      change your name.');
    }
    else {
      changeName(req.user.id, req.body.firstname, req.body.lastname);
      req.flash('messageSuccess', 'Your name has been changed.');
    }
    res.redirect('back');
  });

  app.post('/changeemail', function(req, res) {
    if (req.user.username === 'demo') {
      req.flash('messageFail', 'Sorry. You are using a demo account so you cannot \
      change your email.');
    }
    else {
      changeEmail(req.user.id, req.body.email);
      req.flash('messageSuccess', 'Your email has been changed.');
    }
    res.redirect('back');
  });

  app.post('/changepw', function(req, res) {
    if (req.user.username === 'demo') {
      req.flash('messageFail', 'Sorry. You are using a demo account so you cannot \
      change your password.');
    }
    // Is there a way to move this into profile.js?
    // If I move the redirect out of connection.query, the messages are not flashed
    // I can't move redirect into the module
    else {
      connection.query("SELECT * FROM users WHERE id = ?", [req.user.id], function(err, rows) {
        if (err) throw err;
        else if (!bcrypt.compareSync(req.body.oldpw, rows[0].password)) {
          req.flash('messageFail', 'Your old password is incorrect.');
        } else if (req.body.newpw !== req.body.newpw2) {
          req.flash('messageFail', 'Your new passwords do not match.');
        } else {
          connection.query("UPDATE users SET password = ? WHERE id = ?", [bcrypt.hashSync(req.body.newpw, null, null), req.user.id], function(err, rows) {
            if (err) throw err;
          });
          req.flash('messageSuccess', 'Your password has been changed. Please \
          logout for your new password to take effect.');
        }
      });
    }
    res.redirect('back');
  });

  app.get('/word-list', isLoggedIn, function(req, res) {
    getWordList(req.user.id, function(err, data) {
      res.render('word-list', {
        title: 'Word List',
        user: req.user,
        wordlist: data
      });
    });
  });

  app.post('/addword', function(req, res) {
    addWord(req.user.id, req.body.word, req.body.pos, req.body.meaning);
    res.redirect('back');
  });

  app.post('/editword', function(req, res) {
    editWord(req.user.id, req.body.id, req.body.word, req.body.pos, req.body.meaning);
    res.redirect('back');
  });

  // don't know why I can't use delete method, it says cannot GET /deleteword
  app.post('/deleteword', function(req, res) {
    deleteWord(req.user.id, req.body.id);
    res.redirect('back');
  });

  app.get('/review', isLoggedIn, function(req, res) {
    getRevWordList(req.user.id, function(err, data) {
      res.render('review', {
        title: 'Review',
        user: req.user,
        wordlist: data
      });
    });
  });

  app.post('/remword', function(req, res) {
    remword2(req.user.id, req.body);
    res.send('ok');
  });

  app.get('/dictionary', isLoggedIn, function(req, res) {
    res.render('dictionary', {
      title: 'Dictionary',
      user: req.user,
      message: req.flash('messageSuccess')
    });
  });

  app.post('/searchword', function(req, res) {
    searchword(req.body.word, function(err, data) {
      res.send(data);
    });
  });

  app.post('/addworddict', function(req, res) {
    addWord(req.user.id, req.body.word, req.body.pos, req.body.meaning);
    req.flash('messageSuccess', 'Word added successfully.');
    res.redirect('back');
  });

  app.post('/addwords', function(req, res) {
    for (var i = 0; i < req.body.words.length; i++) {
      addWord(req.user.id, req.body.words[i][0], req.body.words[i][1], req.body.words[i][2]);
    }
    res.redirect('back');
  });

  app.get('/greword', function(req, res) {
    res.send(fs.readFileSync('public/txt/gre.txt', 'utf8'));
  });

  app.get('/satword', function(req, res) {
    res.send(fs.readFileSync('public/txt/sat.txt', 'utf8'));
  });

  app.get('/toeflword', function(req, res) {
    res.send(fs.readFileSync('public/txt/toefl.txt', 'utf8'));
  });

  app.get('/statistics', isLoggedIn, function(req, res) {
    res.render('statistics', {
      title: 'Statistics',
      user: req.user
    });
  });

  app.get('/numwordstoday', function(req,res){
    numWordsToday(req.user.id, function(err, data) {
      res.send({numWordsToday: data});
    });
  });

  app.get('/numwordsprog', function(req,res){
    numWordsProg(req.user.id, function(err, data) {
      res.send({numWordsProg: data});
    });
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
var fs = require('fs');
connection.query('USE ' + dbconfig.database);
require('./profile.js')();
require('./word-list.js')();
require('./review.js')();
require('./dictionary.js')();
require('./statistics.js')();

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}
