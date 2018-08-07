const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = mongoose.Schema({
	name: String,
	brand: String,
	price: Number,
	description: String,
	image: Array,
	prescription: Boolean,
  usage: String,
  caution: String,
  tags: [ String ],
	quantity: Number,
	status: String
});

const Product = module.exports = mongoose.model('pharmaproduct', ProductSchema);
