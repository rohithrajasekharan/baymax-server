const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/user-model');
const Article = require('../models/article-model');
const Community = require('../models/community-model');
const Answer = require('../models/answer-model');
require("../app")
const ObjectId = mongoose.Types.ObjectId;

router.post('/load', (req, res) => {
  Article.find({ pageName: req.community, type: 'question' }, { title: 1, content: 1, type: 1, videoId: 1, imageId: 1, likes: 1, comments: 1, createdAt: 1 }).sort({ _id: -1 }).limit(20).populate({ path: 'userId', select: '_id name avatar' }).then(data => {
    res.json(data);
  })
});

router.post('/refresh', (req, res) => {
  Article.findOne({ pageName: req.community, type: 'question', _id: { $gt: req.body.lastId } }, { title: 1, content: 1, type: 1, videoId: 1, imageId: 1, likedby: { $elemMatch: { "$eq": ObjectId(req.body.id) } }, likes: 1, comments: 1, createdAt: 1 }).sort({ _id: 1 }).limit(3).populate({ path: 'userId', select: '_id name avatar' }).then(data => {
    res.json(data);
  })
});
router.post('/loadmore', (req, res) => {
  Article.find({ pageName: req.community, type: 'question', _id: { $lt: req.body.lastId } }, { title: 1, content: 1, type: 1, videoId: 1, imageId: 1, likedby: { $elemMatch: { "$eq": ObjectId(req.body.id) } }, likes: 1, comments: 1, createdAt: 1 }).sort({ _id: -1 }).limit(10).populate({ path: 'userId', select: '_id name avatar' }).then(data => {
    res.json(data);
  })
});

router.post('/communityInfo', (req, res) => {
  Community.find({ Name: req.community }, { _id: 0 }).then(data => {
    res.json(data);
  })
});

router.post('/search', (req, res) => {
  var search_term=req.body.s;
  search_term=search_term.replace(/[^a-zA-Z0-9 ]/g, "")
  Article.find({ title: { $regex: search_term}, pageName: req.community, type: 'question' }, { title: 1, content: 1, type: 1, videoId: 1, imageId: 1, likes: 1, comments: 1, createdAt: 1 }).sort({ _id: -1 }).limit(20).populate({ path: 'userId', select: '_id name avatar' }).then(data => {
    res.json(data);
  })
});


router.post('/random', (req, res) => {
  Article.find({ pageName: req.community }, { title: 1, content: 1, type: 1, videoId: 1, imageId: 1, likedby: { $elemMatch: { "$eq": ObjectId(req.body.id) } }, likes: 1, comments: 1, createdAt: 1 }).limit(20).populate({ path: 'userId', select: '_id name avatar' }).then(data => {
    res.json(data);
  })
});

module.exports = router;
