var express = require('express');
var passport = require('passport');
var flash = require('connect-flash');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.set('view engine', 'ejs');

app.use('/public', express.static('public'));
app.use('/node_modules', express.static('node_modules'));
app.use(session({
	secret: 'vocabuilder',
	resave: true,
	saveUninitialized: true
 } ));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.get('/', function(req, res) {
  res.render('index', {
    title: 'Home'
  });
});
app.get('/welcome', function(req, res) {
  res.render('welcome', {title:"Welcome to Vocabuilder"});
});
app.get('/signup', function(req, res) {
  res.render('signup', { message: req.flash('signupMessage'), title: "Sign Up" });
});
app.get('/word-list', function(req, res) {
  res.render('wordlist', {
    title: 'Word List'
  });
});
app.listen(3000);
