const mongoose = require('mongoose');

const AnswerSchema = mongoose.Schema({
	answer: String,
  votes: Number,
  userId: String,
  questionId: String
});

const Answer = module.exports = mongoose.model('Answer', AnswerSchema);
