const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
	productId: String,
  quantity: Number,
  userId: String,
  status: String
});

const Order = module.exports = mongoose.model('Order', OrderSchema);
