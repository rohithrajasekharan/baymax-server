const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProductSchema = mongoose.Schema({
	name: String,
	brand: String,
	price: Number,
	description: String,
	constituents: Array,
	image: Array,
	prescription: Boolean,
  usage: String,
  caution: String,
  tags: [ String ],
	quantity: Number,
	status: String
});

const Product = module.exports = mongoose.model('pharma_product', ProductSchema);
