const router = require('express').Router();
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../models/user-model');
const Query = require('../models/query-model');
const Email = require('../models/email-model');

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


router.post('/addcommunity',(req,res)=>{
    User.findOneAndUpdate({"_id": req.body.id}, {$set: {community: req.body.community}},{new:true}).then((data)=>{
      res.json(data);
    })
})

router.get('/user', (req,res) => {
  res.json(req.user)
});
router.get('/:id', (req,res) => {
  User.findById(req.params.id, {name:1,isDoc:1,_id:1}).then((res)=>{
    res.json(res);
  })
});
//initial call without authentication code
router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}));
//redirect to the url specified with auth code
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/');
});
router.post('/applogin', (req,res)=>{
  User.find({googleId:req.body.googleId}).then((user)=>{
    if (user.length!==0) {
      var data = {
        user: user,
        message: "user already exists"
      }
      res.send(data);
    }else{
      let name = req.body.name;
      let email = req.body.email;
      let googleId = req.body.googleId;
      let newUser = new User({
        name: name,
        email: email,
        googleId: googleId,
        logintype: "google"
      });
      newUser.save().then((user)=>{
        console.log(user);
        res.json(user);
      })
    }
  })
})

router.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    console.log("request");
    res.send("req.user");
    });

router.get('/logout',(req,res) => {
  req.logout();
}
    );
//Landing page form
router.post('/message', (req, res) => {
  let name = req.body.name;
  let mail = req.body.mail;
  let content = req.body.content;
  let query = new Query({
    name: name,
    mail: mail,
    content: content
  });
query.save().then(()=>{
res.send('saved');
});
});
router.post('/getstarted', (req, res) => {
  let query = new Email({
    email: req.body.email
  });
query.save().then(()=>{
res.send('saved');
});
});

module.exports = router;
