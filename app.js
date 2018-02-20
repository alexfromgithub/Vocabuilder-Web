var express = require('express');

var app = express();

app.set('view engine', 'ejs');

app.use('/public', express.static('public'));
app.use('/node_modules', express.static('node_modules'));
app.get('/', function(req, res){
  res.render('index', {title: 'Home'});
});
app.get('/word-list', function(req, res){
  res.render('wordlist', {title: 'Word List'});
});
app.listen(3000);
