const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('./product');
const Retailer = require('./retailer-model');

const geodataSchema = mongoose.Schema({
  ref_pin: String,
  nearby:[{type: Schema.Types.ObjectId, ref: 'retailer'}]
});

const Geodata = module.exports =  mongoose.model('geodata', geodataSchema);
