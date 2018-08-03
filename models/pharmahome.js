const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('./product');

const PharmaHomeSchema = mongoose.Schema({
  category: String,
  banner: [{
    image: String,
    title: String,
    description: String,
    url: String
  }],
  products: [{type: Schema.Types.ObjectId, ref: 'pharmaproduct'}]
});

const PharmaHome = module.exports = mongoose.model('pharmahome', PharmaHomeSchema);
