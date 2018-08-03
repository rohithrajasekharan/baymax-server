const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('./product');

const OrderSchema = mongoose.Schema({
	productId: {type: Schema.Types.ObjectId, ref: 'pharmaproduct'},
  quantity: Number,
  userId: String,
  status: String
});

const Order = module.exports = mongoose.model('Order', OrderSchema);
