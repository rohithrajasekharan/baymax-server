const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('./product');

const retailerSchema = mongoose.Schema({
  name: String,
  rating: Number,
  address: String,
  location: String,
  pincode:String,
  image:String,
  avpr:[{type: Schema.Types.ObjectId, ref: 'product'}]
});

const Retailer = module.exports =  mongoose.model('retailer', retailerSchema);
