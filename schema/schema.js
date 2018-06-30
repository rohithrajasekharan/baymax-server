const graphql = require('graphql');
const GraphQLDate = require('graphql-date');
const moment = require('moment');
const Article = require('../models/article-model');
const Opinion = require('../models/comment-model');
const Answer = require('../models/answer-model');
const Question = require('../models/question-model');
const User = require('../models/user-model');
const Product = require('../models/product');
const Order = require('../models/orders-model');
const Cart = require('../models/cart-model');
const articleBookmark = require('../models/bookmark-model').articleBookmark;
const questionBookmark = require('../models/bookmark-model').questionBookmark;
const DiabetesMessage = require('../models/message-model').DiabetesMessage;
const BabyandmeMessage = require('../models/message-model').BabyandmeMessage;
var ObjectId = require('mongodb').ObjectID;
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean
} = graphql;


const ArticleType = new GraphQLObjectType({
    name: 'Article',
    fields: ( ) => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        pageName: { type: GraphQLString },
        videoId: {type: GraphQLString},
        imageId: {type: GraphQLString},
        likes: {type: GraphQLInt},
        comments: {type: GraphQLInt},
        createdAt: {type: GraphQLString,
        resolve(parent, args){
            return moment(parent.createdAt, moment.ISO_8601);
        }},
        author: {
            type: UserType,
            resolve(parent, args){
                return User.findById(parent.userId);
            }
        },
        opinions: {
            type: new GraphQLList(OpinionType),
            resolve(parent){
                return Opinion.find({ articleId: parent.id}).limit(5);
            }
        },
        likedby: { type: new GraphQLList(GraphQLID) },
        isliked: {
          type: GraphQLBoolean,
          args: {userId: { type: GraphQLID }},
          resolve(parent, args){
return (parent.likedby.indexOf(args.userId)>-1);
          }
        }
    })
});

const OpinionType = new GraphQLObjectType({
    name: 'Opinion',
    fields: ( ) => ({
        id: { type: GraphQLID },
        message: { type: GraphQLString },
        articleId: { type: GraphQLString },
        userId: { type: GraphQLString },
        createdAt: {
          type: GraphQLString,
            resolve(parent, args){
              var today = new Date(parent.createdAt);
              var dd = today.getDate();
              var mm = today.getMonth()+1;
              var yyyy = today.getFullYear();
              var hr = today.getHours();
              var min = today.getMinutes();
              return((dd <= 9 ? '0' + dd : dd)+"-"+(mm <= 9 ? '0' + mm : mm)+"-"+yyyy+" at "+(hr >= 12 ? hr-12+":"+(min<=9?"0"+min:min)+" pm ":hr+":"+(min<=9?"0"+min:min)+" am "));
        }
      },
        article: {
            type: ArticleType,
            resolve(parent, args){
                return Article.findById(parent.articleId);
            }
        },
        user: {
          type: UserType,
          resolve(parent, args){
              return User.findById(parent.userId);
          }
        }
    })
});

const AnswerType = new GraphQLObjectType({
    name: 'Answer',
    fields: ( ) => ({
        id: { type: GraphQLID },
        answer: { type: GraphQLString },
        question: {
            type: QuestionType,
            resolve(parent, args){
                return Question.findById(parent.questionId);
            }
        },
        votes: { type: GraphQLInt },
        user: {
          type: UserType,
          resolve(parent, args){
              return User.findById(parent.userId);
          }
        }
    })
});

const QuestionType = new GraphQLObjectType({
    name: 'Question',
    fields: ( ) => ({
        id: { type: GraphQLID },
        question: { type: GraphQLString },
        description: { type: GraphQLString },
        pageName: { type: GraphQLString },
        createdAt: {type: GraphQLString,
        resolve(parent, args){
            return moment(parent.createdAt, moment.ISO_8601);
        }},
        author: {
          type: UserType,
          resolve(parent, args){
              return User.findById(parent.userId);
          }
        },
        answercount: {
            type: GraphQLInt,
            resolve(parent, args){
                return Answer.find({ questionId: parent.id }).count();
            }
        },
        answers: {
            type: new GraphQLList(AnswerType),
            resolve(parent, args){
                return Answer.find({ questionId: parent.id });
            }
        }
    })
});


const UserType = new GraphQLObjectType({
    name: 'User',
    fields: ( ) => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        isDoc: { type: GraphQLBoolean },
        avatar: {type: GraphQLString},
        logintype: { type: GraphQLString },
        articles: {
            type: new GraphQLList(ArticleType),
            resolve(parent, args){
                return Article.find({ userId: parent.id });
            }
        },
        questions: {
                  type: new GraphQLList(QuestionType),
                  resolve(parent, args){
                      return Question.find({ userId: parent.id });
                  }
          },
          articlebookmark: {  type: new GraphQLList(ArticleType) },
          questionbookmark: { type: new GraphQLList(QuestionType) }
    })
});


const FeedType = new GraphQLObjectType({
    name: 'Feed',
    fields: ( ) => ({
        articles: {
          type: new GraphQLList(ArticleType),
          args: {
            pageName: { type: GraphQLString },
            limit: { type: new GraphQLNonNull(GraphQLInt) },
            lastId: { type: new GraphQLNonNull(GraphQLString) },
            order: { type: new GraphQLNonNull(GraphQLInt) }
           },
          resolve(parent, args){
            if (args.lastId=="" && args.order==1) {
              return Article.find({pageName: args.pageName}).sort({_id:-1}).limit(args.limit);
            }else if (args.order==1) {
              return Article.find({pageName: args.pageName ,_id: {$gt: args.lastId}}).sort({_id:-1}).limit(args.limit);
            }else if (args.order==-1) {
              return Article.find({pageName: args.pageName ,_id: {$lt: args.lastId}}).sort({_id:-1}).limit(args.limit);
            }
          }
        },
        questions: {
          type: new GraphQLList(QuestionType),
          args: {
            pageName: { type: GraphQLString },
            limit: { type: new GraphQLNonNull(GraphQLInt) },
            lastId: { type: new GraphQLNonNull(GraphQLString) },
            order: { type: new GraphQLNonNull(GraphQLInt) }
           },
          resolve(parent, args){
            if (args.lastId=="" && args.order==1) {
              return Question.find({pageName: args.pageName}).sort({_id:-1}).limit(args.limit);
            }else if (args.order==1){
              return Question.find({pageName: args.pageName ,_id: {$gt: args.lastId}}).sort({_id:-1}).limit(args.limit);
            }else if (args.order==-1){
              return Question.find({pageName: args.pageName ,_id: {$lt: args.lastId}}).sort({_id:-1}).limit(args.limit);
            }           }
        }
    })
});

const MessageType = new GraphQLObjectType({
    name: 'Message',
    fields: ( ) => ({
        message: { type: GraphQLString },
        time: { type: GraphQLString },
        replymessage: { type: GraphQLString },
        replyto: { type: GraphQLString },
        type: { type: GraphQLString },
        username: { type: GraphQLString },
        sender: {
            type: UserType,
            resolve(parent, args){
                return User.findById(parent.sendersId);
            }
        }
    })
});
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        article: {
            type: ArticleType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Article.findById(args.id);
            }
        },
        user: {
            type: UserType,
            args: {
              id: { type: GraphQLID },
              skip: { type: GraphQLInt },
            },
            resolve(parent, args){
                return User.findById(args.id).populate({path: 'articlebookmark', options: { limit: 10, skip: args.skip }}).populate({path: 'questionbookmark', options: { limit: 10, skip: args.skip }});
            }
        },
        articles: {
          type: new GraphQLList(ArticleType),
          args: { pageName: { type: GraphQLString } },
          resolve(parent, args){
              return Article.find({pageName: args.pageName}).sort({_id:-1});
          }
        },
        questions: {
            type: new GraphQLList(QuestionType),
            args: { pageName: { type: GraphQLString } },
            resolve(parent, args){
                return Question.find({pageName: args.pageName}).sort({_id:-1});
            }
        },
        question: {
            type: QuestionType,
            args: { id: { type: GraphQLString } },
            resolve(parent, args){
                return Question.findById(args.id);
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args){
                return User.find().populate('articlebookmark').populate('questionbookmark');
            }
        },
        opinions: {
            type: new GraphQLList(OpinionType),
            args: {
               id: { type: GraphQLID },
               limit: { type: new GraphQLNonNull(GraphQLInt) },
               skip: { type: new GraphQLNonNull(GraphQLInt) }
           },
            resolve(parent, args){
              return Opinion.find({articleId: args.id}).sort({_id:-1}).skip(args.skip).limit(args.limit);
            }
        },
        answers: {
            type: new GraphQLList(AnswerType),
            args: { id: { type: GraphQLID },
            limit: { type: new GraphQLNonNull(GraphQLInt) },
            skip: { type: new GraphQLNonNull(GraphQLInt) }
          },
            resolve(parent, args){
                return Answer.find({questionId: args.id}).skip(args.skip).limit(args.limit);
            }
        },
        feed: {
          type: FeedType,
           resolve(parent, args){
               return FeedType;
           }
        },
        loadchat: {
            type: new GraphQLList(MessageType),
            args: { pageName: { type: new GraphQLNonNull(GraphQLString) },
            id: { type: new GraphQLNonNull(GraphQLID) }
           },
            resolve(parent, args){
              if (args.pageName==="Diabetes" && args.id=="") {
                  return DiabetesMessage.find().limit(50).sort({_id:-1});
              }else if (args.pageName==="Baby and Me" && args.id==""){
                  return BabyandmeMessage.find().limit(50).sort({_id:-1});
              }else if (args.pageName==="Diabetes" && args.id!=="") {
                  return DiabetesMessage.find({_id: {$lt: args.id}}).limit(50).sort({_id:-1});
              }else {
                  return BabyandmeMessage.find({_id: {$lt: args.id}}).limit(50).sort({_id:-1});
              }

            }
        },
        newMessages: {
            type: GraphQLInt,
            args: {
              pageName: { type: new GraphQLNonNull(GraphQLString) },
              id: { type: new GraphQLNonNull(GraphQLID) }
             },
            resolve(parent, args){
              if (args.pageName=="Diabetes") {
                  return DiabetesMessage.find({_id: {$gt: args.id}}).limit(50).count();
              }else {
                  return BabyandmeMessage.find({_id: {$gt: args.id}}).limit(50).count();
              }

            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addArticle: {
            type: ArticleType,
            args: {
                title: { type: new GraphQLNonNull(GraphQLString) },
                content: { type: new GraphQLNonNull(GraphQLString) },
                userId: { type: new GraphQLNonNull(GraphQLID) },
                pageName: { type: new GraphQLNonNull(GraphQLString) },
                videoId: { type: GraphQLString},
                imageId: { type: GraphQLString}
            },
            resolve(parent, args){
                let article = new Article({
                    title: args.title,
                    content: args.content,
                    pageName: args.pageName,
                    userId: args.userId,
                    videoId: args.videoId,
                    imageId: args.imageId,
                    createdAt: Date.now(),
                    likes:0,
                    comments:0
                });
                return article.save();
            }
        },
        addOpinion: {
            type: OpinionType,
            args: {
                message: { type: new GraphQLNonNull(GraphQLString) },
                articleId: { type: new GraphQLNonNull(GraphQLID) },
                userId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args){
                let opinion = new Opinion({
                    message: args.message,
                    articleId: args.articleId,
                    userId: args.userId,
                    createdAt: Date.now()
                });
                return new Promise((resolve,reject)=>{
              Article.update({_id :args.articleId}, {$inc : {'comments' : 1}}).then(()=>{
              resolve(opinion.save())
              })
       })
     }
        },
        addQuestion: {
            type: QuestionType,
            args: {
                question: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLString },
                userId: { type: new GraphQLNonNull(GraphQLID) },
                pageName: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args){
                let question = new Question({
                    question: args.question,
                    description: args.description,
                    userId: args.userId,
                    pageName: args.pageName,
                    createdAt: Date.now()
                });
                return question.save();
            }
        },
        addAnswer: {
            type: AnswerType,
            args: {
                answer: { type: new GraphQLNonNull(GraphQLString) },
                questionId: { type: new GraphQLNonNull(GraphQLID) },
                userId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args){
                let answer = new Answer({
                    answer: args.answer,
                    questionId: args.questionId,
                    userId: args.userId,
                    createdAt: Date.now(),
                    votes: 0
                });
                return answer.save();
            }
        },
        addBookmark: {
            type: GraphQLString,
            args: {
                userId: { type: new GraphQLNonNull(GraphQLID) },
                articleId:  { type: GraphQLID },
                questionId: { type: GraphQLID },
                type: { type: GraphQLString }
            },
            resolve(parent, args){
              if (args.articleId=="" && args.type=="add") {
                return new Promise((resolve,reject)=>{
              User.findOneAndUpdate({_id :args.userId}, { $addToSet: { 'questionbookmark': args.questionId } }).then((data)=>{
      console.log(data);
      resolve('Added Question to bookmark')
              })
       })
     }
     else if (args.questionId=="" && args.type=="add"){
                return new Promise((resolve,reject)=>{
              User.findOneAndUpdate({_id :args.userId}, { $addToSet: { 'articlebookmark': args.articleId } }).then((data)=>{
              console.log(data);
              resolve('Added Article to bookmark')
              })
       })
              }
              else if (args.articleId=="" && args.type=="remove"){
                         return new Promise((resolve,reject)=>{
                       User.findOneAndUpdate({_id :args.userId}, { $pull: { 'questionbookmark': args.questionId} }).then((data)=>{
                       resolve('Removed Question from bookmark')
                       })
                })
                       }
                       else if (args.questionId=="" && args.type=="remove"){
                                  return new Promise((resolve,reject)=>{
                                User.findOneAndUpdate({_id :args.userId}, { $pull: { 'articlebookmark': args.articleId } }).then((data)=>{
                                resolve('Removed Article from bookmark')
                                })
                         })
                                }
            }
        },
        likearticle: {
            type: GraphQLString,
            args: {
                userId: { type: new GraphQLNonNull(GraphQLID) },
                articleId: { type: new GraphQLNonNull(GraphQLID) },
                type: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args){
              if (args.type=='like') {
                return new Promise((resolve,reject)=>{
              Article.findOneAndUpdate({_id :args.articleId}, {$inc : {'likes' : 1}, $push: { 'likedby': args.userId } }).then((data)=>{
              resolve('Success')
              })
       })
              }
              else if (args.type=='dislike') {
                return new Promise((resolve,reject)=>{
              Article.findOneAndUpdate({_id :args.articleId}, {$inc : {'likes' : -1}, $pull: { 'likedby': args.userId } }).then((data)=>{
              resolve('Success')
              })
       })
              }

            }
        },
        voteanswer: {
            type: GraphQLString,
            args: {
                userId: { type: new GraphQLNonNull(GraphQLID) },
                answerId: { type: new GraphQLNonNull(GraphQLID) },
                type: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args){
              if (args.type=='upvote') {
                return new Promise((resolve,reject)=>{
              Answer.findOneAndUpdate({_id :args.answerId}, {$inc : {'votes' : 1}}).then((data)=>{
                User.findById(args.userId).then((user)=>{
                  if (user.isDoc) {
                    resolve('upvoted by doctor')
                  }else {
                    resolve('upvoted')
                  }
                })
              })
       })
              }
              else if (args.type=='downvote') {
                return new Promise((resolve,reject)=>{
              Answer.findOneAndUpdate({_id :args.answerId}, {$inc : {'votes' : -1}}).then((data)=>{
              resolve('Downvoted')
              })
       })
              }

            }
        },
        removeOpinion: {
            type: GraphQLString,
            args: {
                opinionId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args){
                return new Promise((resolve,reject)=>{
            Opinion.findById(args.opinionId).then((opinion)=>{
              Article.findOneAndUpdate({_id :opinion.articleId}, {$inc : {'comments' : -1}}).then(()=>{
              opinion.remove().then(()=>{
                resolve('opinion removed')
              })
              })
            })
       })
     }
   },
   removeArticle: {
       type: GraphQLString,
       args: {
           articleId: { type: new GraphQLNonNull(GraphQLID) }
       },
       resolve(parent, args){
           return new Promise((resolve,reject)=>{
       Article.findById(args.articleId).then((article)=>{
         article.remove().then(()=>{
           resolve('Article removed')
         })
       })
  })
}
},
removeQuestion: {
    type: GraphQLString,
    args: {
        questionId: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve(parent, args){
        return new Promise((resolve,reject)=>{
    Question.findById(args.questionId).then((question)=>{
      question.remove().then(()=>{
        resolve('Question removed')
      })
    })
})
}
},
removeAnswer: {
    type: GraphQLString,
    args: {
        answerId: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve(parent, args){
        return new Promise((resolve,reject)=>{
    Answer.findById(args.answerId).then((answer)=>{
      answer.remove().then(()=>{
        resolve('Answer removed')
      })
    })
})
}
}

    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
