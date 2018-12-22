const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const retailerSchema = mongoose.Schema({
  name: String,
  rating: Number,
  address: String,
  location: String,
  pincode:String,
  image:String
});

const Retailer = module.exports =  mongoose.model('retailer', retailerSchema);
