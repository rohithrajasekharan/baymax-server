const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/user-model');

const MessagesSchema = mongoose.Schema({
	 sendersId: String,
	 username: String,
   message: String,
	 type: String,
	 replyto: String,
	 replymessage: String,
	 time: Date
});

const DiabetesMessage = mongoose.model('diabetes_message', MessagesSchema);
const BabyandmeMessage = mongoose.model('babyandme_message', MessagesSchema);

module.exports = {
  'DiabetesMessage': DiabetesMessage,
  'BabyandmeMessage': BabyandmeMessage
}
