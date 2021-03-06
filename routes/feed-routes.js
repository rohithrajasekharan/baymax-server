const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/user-model');
const Article = require('../models/article-model');
const Answer = require('../models/answer-model');
const ObjectId = mongoose.Types.ObjectId;

router.post('/load', (req, res) => {
Article.find({pageName: req.body.pageName},{title: 1, content: 1 ,type:1,videoId:1,imageId:1,likedby:{ $elemMatch : { "$eq": ObjectId(req.body.id) }},likes: 1,comments:1,createdAt:1}).skip(10).sort({_id:-1}).limit(20).populate({path: 'userId',select: '_id name avatar'}).then(data=>{
  res.json(data);
})
});

router.post('/refresh', (req, res) => {
Article.find({pageName: req.body.pageName,_id: {$gt: req.body.lastId}},{title: 1, content: 1 ,type:1,videoId:1,imageId:1,likedby:{ $elemMatch : { "$eq": ObjectId(req.body.id) }},likes: 1,comments:1,createdAt:1}).sort({_id:1}).limit(3).populate({path: 'userId',select: '_id name avatar'}).then(data=>{
  res.json(data);
})
});
router.post('/loadmore', (req, res) => {
Article.find({pageName: req.body.pageName,_id: {$lt: req.body.lastId}},{title: 1, content: 1 ,type:1,videoId:1,imageId:1,likedby:{ $elemMatch : { "$eq": ObjectId(req.body.id) }},likes: 1,comments:1,createdAt:1}).sort({_id:-1}).limit(10).populate({path: 'userId',select: '_id name avatar'}).then(data=>{
  res.json(data);
})
});
router.post('/refresh/priority', (req, res) => {
  Article.findById(req.body.lastId,(err, article)=>{
    Article.find({pageName: req.body.pageName,weight: {$gt: article.weight}},{title: 1, content: 1 ,type:1,weight:1,videoId:1,imageId:1,likedby:{ $elemMatch : { "$eq": ObjectId(req.body.id) }},likes: 1,comments:1,createdAt:1}).sort({weight:-1}).limit(3).populate({path: 'userId',select: '_id name avatar'}).then(data=>{
      res.json(data);
    })
  })
});

router.post('/random', (req, res) => {
Article.find({pageName: req.body.pageName},{title: 1, content: 1 ,type:1,videoId:1,imageId:1,likedby:{ $elemMatch : { "$eq": ObjectId(req.body.id) }},likes: 1,comments:1,createdAt:1}).limit(20).populate({path: 'userId',select: '_id name avatar'}).then(data=>{
  res.json(data);
})
});

module.exports = router;
