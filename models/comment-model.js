const mongoose = require('mongoose');

const OpinionSchema = mongoose.Schema({
	message: String,
	articleId: String,
  userId: String,
	createdAt: Date
});

const Opinion = module.exports = mongoose.model('Opinion', OpinionSchema);
