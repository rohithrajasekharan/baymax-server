const mongoose = require('mongoose');
const Product = require('./product');
const Schema = mongoose.Schema;

const PharmaHomeSchema = mongoose.Schema({
  category: String,
  banner: [{
    image: String,
    title: String,
    description: String,
    url: String
  }],
  products: [{type: Schema.Types.ObjectId, ref: 'Product'}]
});

const PharmaHome = module.exports = mongoose.model('pharmahome', PharmaHomeSchema);
