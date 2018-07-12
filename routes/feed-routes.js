const router = require('express').Router();
const mongoose = require('mongoose');
const Article = require('../models/article-model');
const Question = require('../models/question-model');

router.get('/newsfeed',(req,res)=>{
  Article.find("userId":req.params.id).limit(10).then((article)=>{
    res.json(article)
  });
})
