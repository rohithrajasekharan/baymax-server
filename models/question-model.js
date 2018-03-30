const mongoose = require('mongoose');

const QuestionSchema = mongoose.Schema({
	question: String,
  userId: String
});

const Question = module.exports = mongoose.model('Question', QuestionSchema);
