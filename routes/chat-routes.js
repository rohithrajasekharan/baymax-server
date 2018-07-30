const router = require('express').Router();
const mongoose = require('mongoose');
const DiacareMessage = require('../models/message-model').DiacareMessage;
const BabyandmeMessage = require('../models/message-model').BabyandmeMessage;
const User = require('../models/user-model');

const Schema = mongoose.Schema;


router.post('/load',(req,res)=>{
  if (req.body.pageName==="Diabetes" && req.body.id=="") {
      DiacareMessage.find().limit(50).sort({_id:-1}).then((resp)=>{
        res.json(resp);
      });
  }else if (req.body.pageName==="Baby and Me" && req.body.id==""){
      BabyandmeMessage.find().limit(50).sort({_id:-1}).then((resp)=>{
        res.json(resp);
      });
  }else if (req.body.pageName==="Diabetes" && req.body.id!=="") {
      DiacareMessage.find({_id: {$lt: req.body.id}}).limit(50).sort({_id:1}).then((resp)=>{
        res.json(resp);
      });
  }else {
      BabyandmeMessage.find({_id: {$lt: req.body.id}}).limit(50).sort({_id:1}).then((resp)=>{
        res.json(resp);
      });
  }
})
router.get('/new/:pageName/:id',(req,res)=>{
  if (req.params.pageName=="Diacare") {
      DiacareMessage.find({_id: {$gt: req.params.id}}).limit(20).count().then((resp)=>{
        res.json(resp);
      });
  }else if (req.params.pageName=="babyandme"){
      BabyandmeMessage.find({_id: {$gt: req.params.id}}).limit(20).count().then((resp)=>{
        res.json(resp);
      });
  }
})


module.exports = router;
