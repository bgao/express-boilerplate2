var passport = require('passport')
  , pass_local = require('./pass-local')
  , mailer = require('./mailer')
  , User = require('../models/user').User;


// TODO: move all user related routes into user.js
module.exports = function(app) {
  app.get('/', function(req, res) {
    res.render('index', { title: "YOUR PROJECT NAME", user: req.user });
  });

  // GET /home
  app.get('/home', function(req, res) {
    res.render('home', { title: 'Account', user: req.user });
  });

  // POST /signup
  app.post('/signup', function(req, res) {
    User.register({ email: req.body.email, password: req.body.password }, function(err, user) {
      if (err) {
        console.log(err);
        // TODO: Update the view to show errors
      } else {
	      mailer(user);
      }
      res.redirect('/');
    });
  });

  // GET /signup
  app.get('/signup', function(req, res) {
    console.log(req.user);
    if (typeof req.query['token'] !== 'undefined') {
      User.activate(req.query['token'], function(err, user) {
	      if (err) {
	        console.log(err);
	      } else {
	        req.user = user;
	      }
	      res.redirect('/login');
      });
    } else {
      res.render('signup', { title: 'Signup', user: req.user });
    }
  });

  // GET /login
  app.get('/login', function(req, res) {
    console.log(req.user);
    res.render('login', { title: 'Login', user: req.user });

  });


  // POST /login
  app.post('/login',
           passport.authenticate('local',
                                 { successRedirect: '/',
						                       failureRedirect: '/login' }));
  // /logout
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};