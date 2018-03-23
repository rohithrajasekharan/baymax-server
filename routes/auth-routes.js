const router = require('express').Router();
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../models/user-model');

router.post('/register', (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  let newUser = new User({
    name: name,
    email: email,
    password: password,
    logintype: "local"
  });
  User.createUser(newUser, (err, user) => {
    passport.authenticate('local')(req, res, function () {
                res.json(user);
            })
  });
});

router.get('/user', (req,res) => {
  res.json(req.user)
});

router.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    res.json(req.user);
    });

router.get('/logout',(req,res) => {
  req.logout();
  res.send(req.user)
}
    );


module.exports = router;
