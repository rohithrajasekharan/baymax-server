const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Address = require('./address-model');

const OrderSchema = mongoose.Schema({
	products: [{
    product:{type: Schema.Types.ObjectId, ref: 'pharmaproduct'},
    quantity:Number,
    _id:false
  }],
  quantity: Number,
  userId: String,
  status: String,
  tracking:[String],
  addressId: {type: Schema.Types.ObjectId, ref: 'user_addresse'},
  order_id:String,
  payment_id:String,
  payment_signature:String
});

const Order = module.exports = mongoose.model('Order', OrderSchema);
