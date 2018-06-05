const graphql = require('graphql');
const Article = require('../models/article-model');
const Opinion = require('../models/comment-model');
const Answer = require('../models/answer-model');
const Question = require('../models/question-model');
const Participant = require('../models/participant-model');
const Conversation = require('../models/conversation-model');
const User = require('../models/user-model');
const Product = require('../models/product');
const Order = require('../models/orders-model');
const Cart = require('../models/cart-model');
const Bookmark = require('../models/bookmark-model');
const DiabetesMessage = require('../models/message-model').DiabetesMessage;
const BabyandmeMessage = require('../models/message-model').BabyandmeMessage;

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
        author: {
            type: UserType,
            resolve(parent, args){
                return User.findById(parent.userId);
            }
        },
        opinions: {
            type: new GraphQLList(OpinionType),
            resolve(parent, args){
                return Opinion.find({ articleId: parent.id });
            }
        }
    })
});

const OpinionType = new GraphQLObjectType({
    name: 'Opinion',
    fields: ( ) => ({
        id: { type: GraphQLID },
        message: { type: GraphQLString },
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
        pageName: { type: GraphQLString },
        author: {
          type: UserType,
          resolve(parent, args){
              return User.findById(parent.userId);
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
          }
    })
});

const ConversationType = new GraphQLObjectType({
    name: 'Conversation',
    fields: ( ) => ({
        id: { type: GraphQLID },
        type: { type: GraphQLString },
        participants: {
                  type: new GraphQLList(ParticipantType),
                  resolve(parent, args){
                      return Participant.find({ conversationId: parent.id });
                  }
          }
    })
});

const ParticipantType = new GraphQLObjectType({
    name: 'Participant',
    fields: ( ) => ({
        id: { type: GraphQLID },
        userinfo: {
          type: UserType,
          resolve(parent, args){
              return User.findById(parent.userId);
          }
        },
        conversations: {
          type: ConversationType,
          resolve(parent, args){
              return Conversation.findById(parent.conversationId);
          }
        }
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
           },
          resolve(parent, args){
            if (args.lastId=="") {
              return Article.find({pageName: args.pageName}).sort({_id:-1}).limit(args.limit);
            }else {
              return Article.find({pageName: args.pageName ,_id: {$gt: args.lastId}}).limit(args.limit);
            }
          }
        },
        questions: {
          type: new GraphQLList(QuestionType),
          args: {
            pageName: { type: GraphQLString },
            limit: { type: new GraphQLNonNull(GraphQLInt) },
            lastId: { type: new GraphQLNonNull(GraphQLString) },
           },
          resolve(parent, args){
            if (args.lastId=="") {
              return Question.find({pageName: args.pageName}).sort({_id:-1}).limit(args.limit);
            }else {
              return Question.find({pageName: args.pageName ,_id: {$gt: args.lastId}}).limit(args.limit);
            }          }
        }
    })
});

const BookmarkType = new GraphQLObjectType({
    name: 'BookmarkType',
    fields: ( ) => ({
        id: { type: GraphQLID },
        userId: { type: GraphQLString },
        articleId: { type: GraphQLString },
        questionId: { type: GraphQLString },
        articles: {
                  type: ArticleType,
                  resolve(parent, args){
                      return Article.findById(parent.articleId);
                  }
          },
        questions: {
          type: QuestionType,
          resolve(parent, args){
              return Question.findById(parent.questionId);
          }
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
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return User.findById(args.id);
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
            args: { id: { type: GraphQLString } },
            resolve(parent, args){
                return Question.find({pageName: args.id}).sort({_id:-1});
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args){
                return User.find({});
            }
        },
        opinions: {
            type: new GraphQLList(OpinionType),
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Opinion.find({articleId: args.id});
            }
        },
        answers: {
            type: new GraphQLList(AnswerType),
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Answer.find({questionId: args.id});
            }
        },
        bookmarks: {
            type: new GraphQLList(BookmarkType),
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Bookmark.find({userId: args.id});
            }
        },
        conversations: {
            type: new GraphQLList(ConversationType),
            resolve(parent, args){
                return Conversation.find();
            }
        },
        participants: {
          type: new GraphQLList(ParticipantType),
          resolve(parent, args){
              return Participant.find();
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
            args: { pageName: { type: new GraphQLNonNull(GraphQLString) } },
            resolve(parent, args){
              if (args.pageName==="Diabetes") {
                  return DiabetesMessage.find().limit(50).sort({_id:-1});
              }else {
                  return BabyandmeMessage.find().limit(50).sort({_id:-1});
              }

            }
        },
        oldermessages: {
          type: new GraphQLList(MessageType),
          args: {
            pageName: { type: new GraphQLNonNull(GraphQLString) },
            id: { type: new GraphQLNonNull(GraphQLID) }
           },
          resolve(parent, args){
            if (args.pageName==="Diabetes") {
                return DiabetesMessage.find({_id: {$lt: args.id}}).limit(50).sort({_id:-1});
            }else {
                return BabyandmeMessage.find({_id: {$lt: args.id}}).limit(50).sort({_id:-1});
            }

          }
        },
        newMessages: {
            type: new GraphQLList(MessageType),
            args: {
              pageName: { type: new GraphQLNonNull(GraphQLString) },
              id: { type: new GraphQLNonNull(GraphQLID) }
             },
            resolve(parent, args){
              if (args.pageName==="Diabetes") {
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
                    imageId: args.imageId
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
                    userId: args.userId
                });
                return opinion.save();
            }
        },

        addQuestion: {
            type: QuestionType,
            args: {
                question: { type: new GraphQLNonNull(GraphQLString) },
                userId: { type: new GraphQLNonNull(GraphQLID) },
                pageName: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args){
                let question = new Question({
                    question: args.question,
                    userId: args.userId,
                    pageName: args.pageName
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
                    userId: args.userId
                });
                return answer.save();
            }
        },
        addParticipant: {
            type: ParticipantType,
            args: {
                userId: { type: new GraphQLNonNull(GraphQLID) },
                conversationId:  { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args){
                let participant = new Participant({
                    userId: args.userId,
                    conversationId: args.conversationId
                });
                return participant.save();
            }
        },
        addBookmark: {
            type: BookmarkType,
            args: {
                userId: { type: new GraphQLNonNull(GraphQLID) },
                articleId:  { type: GraphQLID },
                questionId: { type: GraphQLID }
            },
            resolve(parent, args){
                let bookmark = new Bookmark({
                    userId: args.userId,
                    articleId: args.articleId,
                    questionId: args.questionId
                });
                return bookmark.save();
            }
        }

    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
