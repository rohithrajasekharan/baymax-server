const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('./product');
const Retailer = require('./retailer-model')

const CartSchema = mongoose.Schema({
	productId: {type: Schema.Types.ObjectId, ref: 'pharmaproduct'},
  userId: String,
	quantity: Number,
	retailer: [{type: Schema.Types.ObjectId, ref: 'retailer'}]
});

const Cart = module.exports = mongoose.model('Cart', CartSchema);
