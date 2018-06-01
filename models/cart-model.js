const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
	productId: String,
  userId: String
});

const Cart = module.exports = mongoose.model('Cart', CartSchema);
