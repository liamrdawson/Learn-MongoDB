const express = require('express');
const router = express.Router();
const User = require('../models/user');

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
