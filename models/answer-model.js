const mongoose = require('mongoose');

const AnswerSchema = mongoose.Schema({
	answer: String,
  votes: Number,
  userId: String,
  articleId: String,
	type: String,
	createdAt: Date
});

const Answer = module.exports = mongoose.model('Answer', AnswerSchema);
