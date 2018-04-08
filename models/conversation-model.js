const mongoose = require('mongoose');

const ConversationSchema = mongoose.Schema({
	 type: String
});

const Conversation = module.exports = mongoose.model('Conversation', ConversationSchema);
