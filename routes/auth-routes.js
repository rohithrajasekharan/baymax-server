const router = require('express').Router();
const User = require('../models/user-model');

router.post('/profile', (req,res) => {
  User.findById(req.body.id).then((profile)=>{
    res.json(profile);
  })
});

module.exports = router;
