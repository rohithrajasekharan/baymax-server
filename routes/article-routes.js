const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/user-model');
const Article = require('../models/article-model');
const Answer = require('../models/answer-model');
const Vote = require('../models/vote-model');
const Community = require('../models/community-model');
const Tip = require('../models/tip-model');
const ObjectId = mongoose.Types.ObjectId;

router.post('/new', (req, res) => {
  let newArticle = new Article({
    title: req.body.title,
    content: req.body.content,
    userId: [req.userId],
    pageName: req.community,
    type: req.body.type,
    videoId: req.body.videoId,
    imageId: req.body.imageId,
    likes: 0,
    weight: 5,
    comments: 0,
    createdAt: Date.now()
  });
  newArticle.save().then((article) => {
    res.json(article)
  })
});

router.post('/newq', (req, res) => {
  let newArticle = new Article({
    title: req.body.title,
    content: req.body.content,
    userId: [req.userId],
    pageName: req.community,
    type: 'question',
    likes: 0,
    weight: 5,
    comments: 0,
    createdAt: Date.now()
  });
  newArticle.save().then((article) => {
    Community.findOneAndUpdate({ Name: req.community }, { $inc: { postCount: 1 } }, { new: true }, (err, resp) => {
      if (err) res.status(400).send("Servor Error")
      res.json(article)
    })
  })
});



router.post('/loadarticles', (req, res) => {
  Article.find({ pageName: req.community, type: { $nin: ['question'] } }, { title: 1, content: 1, type: 1, imageId: 1, likedby: { $elemMatch: { "$eq": ObjectId(req.body.id) } }, likes: 1, comments: 1, createdAt: 1 }).populate({ path: 'userId', select: '_id name avatar' }).then(data => {
    res.json(data);
  })
});

router.post('/refresharticles', (req, res) => {
  Article.find({ pageName: req.community, type: { $nin: ['question'] }, _id: { $gt: req.body.lastId } }, { title: 1, content: 1, type: 1, videoId: 1, imageId: 1, likedby: { $elemMatch: { "$eq": ObjectId(req.body.id) } }, likes: 1, comments: 1, createdAt: 1 }).sort({ _id: 1 }).limit(3).populate({ path: 'userId', select: '_id name avatar' }).then(data => {
    res.json(data);
  })
});
router.post('/loadmorearticles', (req, res) => {
  Article.find({ pageName: req.community, type: { $nin: ['question'] }, _id: { $lt: req.body.lastId } }, { title: 1, content: 1, type: 1, videoId: 1, imageId: 1, likedby: { $elemMatch: { "$eq": ObjectId(req.body.id) } }, likes: 1, comments: 1, createdAt: 1 }).sort({ _id: -1 }).limit(10).populate({ path: 'userId', select: '_id name avatar' }).then(data => {
    res.json(data);
  })
});



//for article manager portal
router.post('/load', (req, res) => {
  Article.find({ pageName: req.community, type: 'article' }, { title: 1, content: 1, type: 1, videoId: 1, imageId: 1, likedby: { $elemMatch: { "$eq": ObjectId(req.body.id) } }, createdAt: 1 }).sort({ _id: -1 }).limit(30).populate({ path: 'userId', select: '_id name avatar' }).then(data => {
    res.json(data);
  })
});

router.post('/loadmore', (req, res) => {
  Article.find({ pageName: req.community, _id: { $lt: req.body.lastId } }, { title: 1, content: 1, type: 1, videoId: 1, imageId: 1, likedby: { $elemMatch: { "$eq": ObjectId(req.body.id) } }, likes: 1, comments: 1, createdAt: 1 }).sort({ _id: -1 }).limit(10).populate({ path: 'userId', select: '_id name avatar' }).then(data => {
    res.json(data);
  })
});

router.post('/search', (req, res) => {
  Article.find({ title: { $regex: req.body.s } }, { title: 1, content: 1, createdAt: 1 }).sort({ _id: -1 }).limit(30).populate({ path: 'userId', select: '_id name avatar' }).then(data => {
    res.json(data);
  })
});

router.post('/update', (req, res) => {
  Article.updateOne({ _id: req.body.id }, { $set: { title: req.body.title, content: req.body.content } }).then(data => {
    res.json('sucess')
  })
});
//-------------------------------------------------------------


router.post('/answer', (req, res) => {
  let newComment = new Answer({
    answer: req.body.answer,
    articleId: req.body.articleId,
    userId: req.userId,
    type: req.body.type,
    votes: 0,
    createdAt: Date.now()
  });
  if (req.body.type == 'question') {
    Article.update({ _id: req.body.articleId }, { $inc: { 'comments': 1, 'weight': 4 } }).then(() => {
      newComment.save((err, comment) => {
        res.json(comment);
      });
    })
  } else {
    Article.update({ _id: req.body.articleId }, { $inc: { 'comments': 1, 'weight': 1 } }).then(() => {
      newComment.save((err, comment) => {
        res.json(comment);
      });
    })
  }

});

router.post('/gettip', (req, res) => {
  Tip.find({ pageName: req.community }).sort({ _id: -1 }).limit(1).then((data) => {
    res.send(data)
  })
});

router.post('/like', (req, res) => {
  if (req.body.type == 'like') {
    Article.findOneAndUpdate({ _id: req.body.articleId }, { $inc: { 'likes': 1, 'weight': 1 }, $push: { 'likedby': req.userId } }).then((data) => {
      res.send('Success');
    })
  }
  else if (req.body.type == 'dislike') {
    Article.findOneAndUpdate({ _id: req.body.articleId }, { $inc: { 'likes': -1, 'weight': -1 }, $pull: { 'likedby': req.userId } }).then((data) => {
      res.send('Success');
    })
  }
});

router.post('/vote', (req, res) => {
  var voteState = 0
  var change
  //get current state of user
  Vote.findOne({ userId: req.userId, answerId: req.body.answerId }, function (err, vote) {
    if (vote == null) {
      //if there is no existing vote(doc in collection)
      let newVote = new Vote({
        userId: req.userId,
        answerId: req.body.answerId,
        type: req.body.type
      })
      //make sure its only upvote or downvote and not reset type
      if (req.body.type == "upvote" || req.body.type == "downvote")
        newVote.save((err, vote) => {
          if (err) res.status(400).send("server error")
          if (req.body.type == "upvote") {
            change = 1
          } else if (req.body.type == "downvote") {
            change = -1
          }
          else res.status(400).send("Invalid Request")
          //update the vote state on the answer
          Answer.updateOne({ _id: req.body.answerId }, { $inc: { 'votes': change } }, (err, data) => {
            if (err) res.status(400).send("Server error")
            res.status(200).send("sucess")
          })
        })
      else {
        res.status(400).send("Invalid Request")
      }
    }
    else {
      //already voted (doc is present in db)
      //useful to calculate change in vote count
      var intial = intOf(vote.type) //current value as in db
      if (req.body.type == "reset") {
        //remove the doc from db and update count
        vote.remove().then(() => {
          Answer.updateOne({ _id: req.body.answerId }, { $inc: { 'votes': -intial } }, (err, data) => {
            if (err) res.status(400).send("Server error")
            res.status(200).send("sucess")
          })
        })
      }
      else if (req.body.type == "upvote") {
        //change type to upvote 
        vote.updateOne({ type: "upvote" }, (err, data) => {
          if (err) res.status(400).send("Invalid Request")
          Answer.updateOne({ _id: req.body.answerId }, { $inc: { 'votes': 1-intial } }, (err, data) => {
            if (err) res.status(400).send("Server error")
            res.status(200).send("sucess")
          })
        })
      }
      else if (req.body.type == "downvote") {
        vote.updateOne({ type: "downvote" }, (err, data) => {
          if (err) res.status(400).send("Invalid Request")
          Answer.updateOne({ _id: req.body.answerId }, { $inc: { 'votes': -1-intial } }, (err, data) => {
            if (err) res.status(400).send("Server error")
            res.status(200).send("sucess")
          })
        })
      }
    }
  })

});

function intOf(votetype) {
  if (votetype == "upvote") return 1
  if (votetype == "downvote") return -1
  else return 0
}




router.post('/getvotestate', (req, res) => {
  Vote.findOne({ userId: req.userId, answerId: req.body.answerId }, function (err, vote) {
    res.json(vote.type);
  });
});




router.get('/removearticle/:id', (req, res) => {
  Article.findById(req.params.id).then((article) => {
    article.remove().then(() => {
      res.send('Article removed')
    })
  })

});

router.get('/removeanswer/:id', (req, res) => {
  Answer.findById(req.params.id).then((answer) => {
    answer.remove().then(() => {
      res.send('Answer removed')
    })
  })

});

router.get('/bookmarks/:id', (req, res) => {
  User.find({ _id: req.params.id }, { bookmark: 1, _id: 0 }).populate({ path: 'bookmark', select: '_id title userId content pageName imageId type createdAt comments', populate: { path: "userId", select: '_id name avatar isDoc' } }).populate('bookmark.userId').then((user) => {
    res.json(user);
  })
})
router.post('/bookmark', (req, res) => {
  if (req.body.type == "add") {
    User.findOneAndUpdate({ _id: req.userId }, { $addToSet: { 'bookmark': req.body.articleId } }).then((data) => {

      res.send('Added to bookmark')
    })
  } else {
    User.findOneAndUpdate({ _id: req.userId }, { $pull: { 'bookmark': req.body.articleId } }).then((data) => {

      res.send('Added to bookmark')
    })
  }

})

//router.get('/feed/:pageName/:id', (req, res) => {
//  Article.find({ 'pageName': req.params.pageName }, { title: 1, content: 1, type: 1, videoId: 1, imageId: 1, likedby: { $elemMatch: { "$eq": ObjectId(req.params.id) } }, likes: 1, comments: 1, createdAt: 1 }).sort({ _id: -1 }).limit(10).populate({ path: 'userId', select: '_id name avatar' }).then(data => {
//    res.json(data);
//  })
//});

router.post('/answers', (req, res) => {
  if (parseInt(req.body.limit) == null && req.body.type == 'question') {
    Answer.find({ 'articleId': req.body.id }).populate({ path: 'userId', select: '_id name avatar isDoc' }).limit(30).sort({ 'votes': -1 }).then((answers) => {
      res.json(answers);
    });
  } else if (parseInt(req.body.limit) !== null && req.body.type == 'question') {
    Answer.find({ 'articleId': req.body.id }).populate({ path: 'userId', select: '_id name avatar isDoc' }).limit(parseInt(req.body.limit)).sort({ 'votes': -1 }).then((answers) => {
      res.json(answers);
    });
  } else if (parseInt(req.body.limit) == null && req.body.type !== 'question') {
    Answer.find({ 'articleId': req.body.id }).populate({ path: 'userId', select: '_id name avatar isDoc' }).limit(30).sort({ '_id': -1 }).then((answers) => {
      res.json(answers);
    });
  } else if (parseInt(req.body.limit) !== null && req.body.type !== 'question') {
    Answer.find({ 'articleId': req.body.id }).populate({ path: 'userId', select: '_id name avatar isDoc' }).limit(parseInt(req.body.limit)).sort({ '_id': -1 }).then((answers) => {
      res.json(answers);
    });
  }
});


router.post('/:id', (req, res) => {
  Article.findById(req.params.id).populate({ path: 'userId', select: '_id name avatar' }).then((article) => {
    res.json(article);
  });
});

module.exports = router;
