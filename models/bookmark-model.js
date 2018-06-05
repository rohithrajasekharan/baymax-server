const mongoose = require('mongoose');

const bookmarkSchema = mongoose.Schema({
	articleId: String,
  questionId: String,
  userId: String
});

const Bookmark = module.exports = mongoose.model('Bookmark', bookmarkSchema);
