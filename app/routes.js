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
      title: 'Home'
    });
  });
  app.get('/word-list', function(req, res) {
    res.render('wordlist', {
      title: 'Word List'
    });
  });
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}