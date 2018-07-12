const router = require('express').Router();
const mongoose = require('mongoose');
const Article = require('../models/article-model');
const Comments = require('../models/article-model');
router.post('/new', (req, res) => {
  let name = req.body.name;
  let title = req.body.title;
  let content = req.body.content;
  let opinion = req.body.opinion;
  let user = req.body.user;
  let message = req.body.message;
  let newArticle = new Article({
    name: name,
    title: title,
    content: content 
  });
Article.createArticle(newArticle, (err, article) => {
                res.json(article);
  });
});
router.post('/addcomment', (req, res) => {
  let commentAuthor = req.body.commentAuthor;
  let text = req.body.text;
  let articleId = req.body.articleId;
  let newComment = new Comments({
    commentAuthor: commentAuthor ,
    text: text,
    articleId: articleId
  });
Article.addComment(newComment, (err, article) => {
                  res.json(article);
    });
  });

router.get('/:id', (req,res) => {
  Article.getArticleById(req.params.id, (err, article)=>{
    res.json(article);
  })
});

module.exports = router;
