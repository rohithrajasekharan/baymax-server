const router = require('express').Router();
const mongoose = require('mongoose');
const DiabetesMessage = require('../models/message-model').DiabetesMessage;
const BabyandmeMessage = require('../models/message-model').BabyandmeMessage;
const User = require('../models/user-model');

const Schema = mongoose.Schema;


router.post('/load',(req,res)=>{
  if (req.body.pageName==="Diabetes" && req.body.id=="") {
      return DiabetesMessage.find().limit(50).populate({path: 'userId',select: '_id name isDoc'}).sort({_id:-1});
  }else if (req.body.pageName==="Baby and Me" && req.body.id==""){
      return BabyandmeMessage.find().limit(50).populate({path: 'userId',select: '_id name isDoc'}).sort({_id:-1});
  }else if (req.body.pageName==="Diabetes" && req.body.id!=="") {
      return DiabetesMessage.find({_id: {$lt: req.body.id}}).limit(50).populate({path: 'userId',select: '_id name isDoc'}).sort({_id:-1});
  }else {
      return BabyandmeMessage.find({_id: {$lt: req.body.id}}).limit(50).populate({path: 'userId',select: '_id name isDoc'}).sort({_id:-1});
  }
})
router.get('/new/:pageName/:id',(req,res)=>{
  if (req.params.pageName=="Diabetes") {
      return DiabetesMessage.find({_id: {$gt: req.params.id}}).limit(1).count();
  }else if (req.params.pageName=="babyandme"){
      return BabyandmeMessage.find({_id: {$gt: req.params.id}}).limit(1).count();
  }
})


module.exports = router;
