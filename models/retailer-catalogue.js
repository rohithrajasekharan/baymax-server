const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Retailer = require('./retailer-model');
const Product = require('./product');

const retailerCatSchema = mongoose.Schema({
  r_id:{type: Schema.Types.ObjectId, ref: 'retailer'},
  p_id:{type: Schema.Types.ObjectId, ref: 'product'}
});

const RetailerCat = module.exports =  mongoose.model('retailer_catalog', retailerCatSchema);
