const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('./product');

const PharmaHomeSchema = mongoose.Schema({
  community: String,
  banner: [{type:String}],
  categories:[{
    name:String,
    image:String,
  }],
  communitysections:[{
    name:String,
    structure:String,
    items:[{
      name:String,
      price:Number,
      id:String,
      image:String
    }]
  }]
});

const PharmaHome = module.exports = mongoose.model('pharmahome', PharmaHomeSchema);
