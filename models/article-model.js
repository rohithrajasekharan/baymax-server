const mongoose = require('mongoose');

const ArticleSchema = mongoose.Schema({
	title: String,
	content: String,
	userId: String,
	pageName: String,
	videoId: String,
	imageId: String
});

const Article = module.exports = mongoose.model('Article', ArticleSchema);
