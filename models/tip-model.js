const mongoose = require('mongoose');
const User = require('./user-model');
const Schema = mongoose.Schema;
const tipSchema = mongoose.Schema({
	title: String,
	content: String,
	pageName: String,
	type: String,
  link:String
});

const Article = module.exports = mongoose.model('dailytip', tipSchema);
