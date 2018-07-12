const router = require('express').Router();
const mongoose = require('mongoose');
const Article = require('../models/article-model');
const Answer = require('../models/answer-model');

router.post('/new', (req, res) => {
  let newArticle = new Article({
    title: req.body.title,
    content: req.body.content,
    pageName: req.body.pageName,
    videoId: req.body.videoId,
    imageId: req.body.imageId,
    type: req.body.type,
    createdAt: Date.now(),
    likes: 0,
    comments: 0 
  });
Article.createArticle(newArticle, (err, article) => {
    res.json(article);
  });
});
router.post('/addanswer', (req, res) => {
  let newAnswer = new Answer({
    answer: req.body.answer,
    userId: req.body.userId,
    articleId: req.body.articleId,
    type: req.body.type,
    createdAt: Date.now(),
    votes: 0,
  });
answer.save().then(answer=>{
  res.json(answer)
})
});

router.get('/answers', (req,res) => {
  Answer.find("articleId":req.params.id, (err, answers)=>{
    res.json(article);
  })
});

router.get('/:id', (req,res) => {
  Article.findById(req.params.id, (err, article)=>{
    res.json(article);
  })
});

module.exports = router;
