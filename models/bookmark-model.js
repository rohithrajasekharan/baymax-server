const mongoose = require('mongoose');

const bookmarkSchema = mongoose.Schema({
	bookmarkId: String,
  userId: String
});

const articleBookmark =  mongoose.model('articleBookmark', bookmarkSchema);
const questionBookmark =  mongoose.model('questionBookmark', bookmarkSchema);

module.exports = {
  'articleBookmark': articleBookmark,
  'questionBookmark': questionBookmark
}
