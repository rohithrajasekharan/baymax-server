const router = require('express').Router();
const mongoose = require('mongoose');
const Article = require('../models/article-model');
const Answer = require('../models/answer-model');

router.post('/new', (req, res) => {
  let newArticle = new Article({
     title : req.body.title,
     content : req.body.content,
     userId : req.body.userId,
     type : req.body.type,
     videoId : req.body.videoId,
     imageId : req.body.imageId,
     likes: 0,
     comments: 0,
     createdAt: Date.now()
  });
  newArticle.save().then((article)=>{
    res.json(article);
  })
});
router.get('/feed/:pageName', (req, res) => {
Article.find({pageName:req.params.pageName}).limit(10).then((err,articles)=>{
  res.json(articles);
});
});
router.get('/answers/:id', (req, res) => {
Answer.find({articleId:req.params.id}, (err, article) => {
        res.json(article);
    });
  });

router.get('/:id', (req,res) => {
  Article.findById(req.params.id, (err, article)=>{
    res.json(article);
  })
});

module.exports = router;
