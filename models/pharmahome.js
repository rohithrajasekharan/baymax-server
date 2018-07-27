const mongoose = require('mongoose');
const Product = require('./product');
const Schema = mongoose.Schema;

const PharmaHomeSchema = mongoose.Schema({
  category: String,
  banner: [{type: Schema.Types.ObjectId, ref: 'Product'}],
  primarylist: [{type: Schema.Types.ObjectId, ref: 'Product'}],
  secondarylist: [{type: Schema.Types.ObjectId, ref: 'Product'}],
  highlighted: [{type: Schema.Types.ObjectId, ref: 'Product'}],
  rest: [{type: Schema.Types.ObjectId, ref: 'Product'}]
});

const PharmaHome = module.exports = mongoose.model('PharmaHome', PharmaHomeSchema);
