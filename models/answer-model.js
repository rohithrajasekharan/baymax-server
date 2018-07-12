const mongoose = require('mongoose');
const User = require('./user-model');
const Schema = mongoose.Schema;
const AnswerSchema = mongoose.Schema({
	answer: String,
  votes: Number,
  userId: [{type: Schema.Types.ObjectId, ref: 'User'}],
  articleId: String,
	type: String,
	createdAt: Date
});

const Answer = module.exports = mongoose.model('Answer', AnswerSchema);
