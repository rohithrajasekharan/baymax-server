const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ArticleSchema = mongoose.Schema({
	title: String,
	content: String,
	userId: String,
	pageName: String,
	videoId: String,
	imageId: String,
	likes: Number,
	createdAt: Date,
	likedby: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

const Article = module.exports = mongoose.model('Article', ArticleSchema);
