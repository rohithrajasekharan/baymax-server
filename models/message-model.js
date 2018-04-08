const mongoose = require('mongoose');

const MessagesSchema = mongoose.Schema({
	 conversationId: String,
	 sendersId: String,
   message: String,
	 createdAt: Date
});

const Messages = module.exports = mongoose.model('Messages', MessagesSchema);
