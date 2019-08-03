const mongoose = require('mongoose');

const NotificationSchema = mongoose.Schema({
	userId:String,
	title:String,
	description:String,
	url:String,
	image:String,
	seen:Boolean,
	date:Date
});

const Product = module.exports = mongoose.model('notification', NotificationSchema);
