const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user-model');

const DiacareMessageSchema = mongoose.Schema({
	 userId: [{type: Schema.Types.ObjectId, ref: 'User'}],
   message: String,
	 sender: String,
	 type: String,
	 replyto: String,
	 reply:String,
	 isDoc: Boolean,
	 replyId: [{type: Schema.Types.ObjectId, ref: 'DiacareMessage'}],
	 time: Date
});
const BabyandmeMessageSchema = mongoose.Schema({
	userId: [{type: Schema.Types.ObjectId, ref: 'User'}],
	message: String,
	sender: String,
	type: String,
	replyto: String,
	reply:String,
	isDoc: Boolean,
	replyId: [{type: Schema.Types.ObjectId, ref: 'BabyandmeMessage'}],
	time: Date
});

const DiacareMessage = mongoose.model('diacare_message', DiacareMessageSchema);
const BabyandmeMessage = mongoose.model('babyandme_message', BabyandmeMessageSchema);

module.exports = {
  'DiacareMessage': DiacareMessage,
  'BabyandmeMessage': BabyandmeMessage
}
