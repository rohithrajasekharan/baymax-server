const mongoose = require('mongoose');

const bookmarkSchema = mongoose.Schema({
	articleId: String,
  userId: String
});

const articleBookmark = module.exports =  mongoose.model('articleBookmark', bookmarkSchema,'bookmarks');
