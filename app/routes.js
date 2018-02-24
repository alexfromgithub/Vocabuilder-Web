module.exports = function(app, passport) {
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

	app.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/welcome',
			failureRedirect : '/signup',
			failureFlash : true
		})
	);

	app.get('/word-list', function(req, res) {
	  res.render('wordlist', {
	    title: 'Word List'
	  });
	});
};
