const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/user-model');

const MessagesSchema = mongoose.Schema({
	 conversationId: String,
	 sendersId: [{type: Schema.Types.ObjectId, ref: 'User'}],
   message: String,
	 createdAt: Date
});

const Messages = module.exports = mongoose.model('Messages', MessagesSchema);
