const mongoose = require('mongoose');

const OpinionSchema = mongoose.Schema({
	message: String,
	articleId: String,
  userId: String
});

const Opinion = module.exports = mongoose.model('Opinion', OpinionSchema);
