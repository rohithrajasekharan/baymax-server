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
const _ = require('lodash');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
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

const ProductType = new GraphQLObjectType({
    name: 'Product',
    fields: ( ) => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        price: { type: GraphQLString },
        description: { type: GraphQLString },
        image: {type: GraphQLString},
        prescription: {type: GraphQLString},
        caution: {type: GraphQLString},
        usage: {type: GraphQLString},
        tags: {type: GraphQLList(GraphQLString)}
    })
});

const OrderType = new GraphQLObjectType({
    name: 'Order',
    fields: ( ) => ({
        id: { type: GraphQLID },
        product: {
          type: ProductType,
          resolve(parent, args){
              return Product.findById(parent.productId);
          }
        },
        quantity: {type: GraphQLInt},
        status: {type: GraphQLString}
    })
});
const CartType = new GraphQLObjectType({
    name: 'Cart',
    fields: ( ) => ({
        id: { type: GraphQLID },
        product: {
          type: ProductType,
          resolve(parent, args){
              return Product.findById(parent.productId);
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
                return User.find({}).populate('bookmarks');
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
        products: {
          type: new GraphQLList(ProductType),
          resolve(parent, args){
              return Product.find();
          }
        },
        product: {
          type: ProductType,
          args: { id: { type: GraphQLID } },
          resolve(parent, args){
              return Cart.find({'userId':args.id}).populate('productId');
          }
        },
        orders: {
          type: new GraphQLList(OrderType),
          args: { id: { type: GraphQLID } },
          resolve(parent, args){
            return Order.find({'userId':args.id});
          }
        },
        cart: {
          type: new GraphQLList(OrderType),
          args: { id: { type: GraphQLID } },
          resolve(parent, args){
            return Cart.find({'userId':args.id});
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
        addToCart: {
          type: ProductType,
          args: {
              userId: { type: new GraphQLNonNull(GraphQLID) },
              productId:  { type: new GraphQLNonNull(GraphQLID) }
          },
          resolve(parent, args){
              let cart = new Cart({
                  userId: args.userId,
                  productId: args.productId
              });
              return cart.save();
          }
        },
        addToOrders: {
          type: ProductType,
          args: {
              userId: { type: new GraphQLNonNull(GraphQLID) }
          },
          resolve(parent, args){
            Cart.find({"userId":args.userId}).then((data)=>{
              data.map((product)=>{
                let order = new Order({
                    userId: product.userId,
                    productId: product.productId,
                    status: "awaiting confiramtion"
                });
                order.save();
                product.remove();
              });
            });
          }
        },
        removeFromCart: {
          type: ProductType,
          args: {
              userId: { type: new GraphQLNonNull(GraphQLID) },
              productId:  { type: new GraphQLNonNull(GraphQLID) }
          },
          resolve(parent, args){
              Cart.find({"userId":args.userId,"productId":args.productId}).then((product)=>{
                product.remove();
              })
          }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
