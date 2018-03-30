const mongoose = require('mongoose');

const ArticleSchema = mongoose.Schema({
	title: String,
	content: String,
	userId: String
});

const Article = module.exports = mongoose.model('Article', ArticleSchema);
