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
        user: req.user
      });
    }
    else {
      res.redirect('/');
    }
  });

  app.post('/changename', function(req, res) {
    console.log(req.body.firstname);
    res.redirect('profile');
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

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}
