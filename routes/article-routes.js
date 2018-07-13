const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/user-model');
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

router.post('/answer', (req, res) => {
  let newComment = new Answer({
     answer : req.body.title,
     articleId : req.body.articleId,
     userId : req.body.userId,
     type : req.body.type,
     votes: 0,
     createdAt: Date.now()
  });
  newComment.save().then((answer)=>{
    res.json(answer);
  })
});

router.post('/like', (req, res) => {
  if (req.body.type=='like') {
  Article.findOneAndUpdate({_id :req.body.articleId}, {$inc : {'likes' : 1}, $push: { 'likedby': req.body.userId } }).then((data)=>{
  res.send('Success');
  })
  }
  else if (req.body.type=='dislike') {
  Article.findOneAndUpdate({_id :req.body.articleId}, {$inc : {'likes' : -1}, $pull: { 'likedby': req.body.userId } }).then((data)=>{
  res.send('Success');
  })
  }
});

router.post('/vote', (req, res) => {
  if (req.body.type=='upvote') {
  Answer.findOneAndUpdate({_id :req.body.answerId}, {$inc : {'votes' : 1}}).then((data)=>{
    User.findById(req.body.userId).then((user)=>{
      if (user.isDoc) {
        res.send('upvoted by doctor');
      }else {
        res.send('upvoted');
      }
    })
  })
  }
  else if (req.body.type=='downvote') {
  Answer.findOneAndUpdate({_id :req.body.answerId}, {$inc : {'votes' : -1}}).then((data)=>{
  res.send('Downvoted');
  })
  }

});

router.get('/removearticle/:id', (req, res) => {
  Article.findById(req.params.id).then((article)=>{
    article.remove().then(()=>{
      res.send('Article removed')
    })
  })

});

router.get('/removeanswer/:id', (req, res) => {
  Answer.findById(req.params.id).then((answer)=>{
    answer.remove().then(()=>{
      res.send('Answer removed')
    })
  })

});

router.get('/bookmarks/:id',(req,res)=>{
  User.findById(req.params.id).populate('bookmark').then((user)=>{
    res.json(user);
  })
})

router.get('/feed/:pageName', (req, res) => {
Article.find({'pageName': req.params.pageName},{title: 1, content: 1 ,likedby:1,type:1,videoId:1,imageId:1,likes:1,comments:1,createdAt:1},(err,article)=>{
  var array = [];
  article.map((data)=>{
    if(data.likedby.indexOf("5b3298b918b17419d73fa3fb")>-1){
  var pair = {isliked: true};
  data = {...data._doc, ...pair};
      array.push(data);
    }else{
  var pair = {isliked: false};
  data = {...data._doc, ...pair};
      array.push(data);
    }
  });
    res.json(array);


}).sort({_id:-1}).limit(10).populate({path: 'userId',select: '_id name avatar'})
});
router.get('/answers/:id', (req, res) => {
Answer.find({'articleId':req.params.id}).populate({path: 'userId',select: '_id name avatar isDoc'}).then((answers)=>{
  res.json(answers);
});
  });

router.get('/:id', (req,res) => {
  Article.findById(req.params.id).populate({path:'userId',select: '_id name avatar'}).then((article)=>{
    res.json(article);
  });
});

module.exports = router;
