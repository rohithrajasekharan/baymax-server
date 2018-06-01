const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
	name: String,
	price: Number,
	description: String,
	image: Array,
	prescription: Boolean,
  usage: String,
  caution: String,
  tags: [ String ]
});

const Product = module.exports = mongoose.model('Pharma_products', ProductSchema);
