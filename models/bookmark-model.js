const mongoose = require('mongoose');

const bookmarkSchema = mongoose.Schema({
	bookmarkId: String,
  userId: String
});

const articleBookmark = module.exports =  mongoose.model('articleBookmark', bookmarkSchema);
