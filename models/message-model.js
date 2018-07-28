const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user-model');

const DiabetesMessageSchema = mongoose.Schema({
	 userId: [{type: Schema.Types.ObjectId, ref: 'User'}],
   message: String,
	 sender: String,
	 type: String,
	 replyto: String,
	 reply:String,
	 replyId: [{type: Schema.Types.ObjectId, ref: 'DiabetesMessage'}],
	 time: Date
});
const BabyandmeMessageSchema = mongoose.Schema({
	userId: [{type: Schema.Types.ObjectId, ref: 'User'}],
	message: String,
	sender: String,
	type: String,
	replyto: String,
	reply:String,
	replyId: [{type: Schema.Types.ObjectId, ref: 'BabyandmeMessage'}],
	time: Date
});

const DiabetesMessage = mongoose.model('diabetes_message', DiabetesMessageSchema);
const BabyandmeMessage = mongoose.model('babyandme_message', BabyandmeMessageSchema);

module.exports = {
  'DiabetesMessage': DiabetesMessage,
  'BabyandmeMessage': BabyandmeMessage
}
