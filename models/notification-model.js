const mongoose = require('mongoose');

const NotificationSchema = mongoose.Schema({
	userid:String,
	title:String,
	description:String,
	url:String,
	image:String
});

const Product = module.exports = mongoose.model('notification', NotificationSchema);
