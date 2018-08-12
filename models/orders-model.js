const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('./product');
const Address = require('./address-model');

const OrderSchema = mongoose.Schema({
	productId: {type: Schema.Types.ObjectId, ref: 'pharmaproduct'},
  quantity: Number,
  userId: String,
  status: String,
	addressId: {type: Schema.Types.ObjectId, ref: 'user_addresse'}
});

const Order = module.exports = mongoose.model('Order', OrderSchema);
