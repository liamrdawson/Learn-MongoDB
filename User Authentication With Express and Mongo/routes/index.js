const express = require('express');
const router = express.Router();
const User = require('../models/user');

//  GET /profile
router.get('/profile', function(req, res, next) {
  if (! req.session.userId ) {
    var err = new Error("You are not authorized to view this page.");
    err.status = 403;
    return next(err);
  }
  User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          return res.render('profile', { title: 'Profile', name: user.name, favourite: user.favouriteBook });
        }
      });
});

// GET /logout
router.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

//  GET /login
router.get('/login', function(req, res, next) {
  return res.render('login', {title: 'Log In'});
});

//  POST /login
router.post('/login', function(req, res, next) {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function(error, user) {
      if (error || !user) {
        const err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/proflie');
      }
    });
  } else {
    const err = new Error('Email and password required.');
    err.status = 401;
    return next(err);
  }
});

// GET /register
router.get('/register', function(req, res, next) {
  return res.render('register', { title: 'Sign Up' });
});

// POST /register
router.post('/register', function(req, res, next) {
  if (req.body.email &&
      req.body.name &&
      req.body.favouriteBook &&
      req.body.password &&
      req.body.confirmPassword) {

        //confirm that the password has been entered twice identically
        if (req.body.password !== req.body.confirmPassword) {
          let err = new Error('Password does not match');
          err.status = 400;
          return next(err);
        } 

        let userData = {
          email : req.body.email, 
          name  : req.body.name,
          favouriteBook : req.body.favouriteBook,
          password : req.body.password
        };

        //  Use schema create method to insert document into Mongo
        User.create(userData, function (error, user) {
          if (error) {
            return next(error);
          } else {
            req.session.userId = user._id;
            return res.redirect('/profile');
          }
        })

    } else {
      let err = new Error('Please complete all fields');
      err.status = 400;
      return next(err);
    }
})

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

module.exports = router;
