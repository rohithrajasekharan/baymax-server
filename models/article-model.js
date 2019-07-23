const mongoose = require('mongoose');
const User = require('./user-model');
const Schema = mongoose.Schema;
const ArticleSchema = mongoose.Schema({
	title: String,
	content: String,
	jist:String,
	userId: [{type: Schema.Types.ObjectId, ref: 'User'}],
	pageName: String,
	type: String,
	videoId: String,
	imageId: String,
	likes: Number,
	weight: Number,
	comments: Number,
	createdAt: Date,
	likedby: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

const Article = module.exports = mongoose.model('Article', ArticleSchema);
