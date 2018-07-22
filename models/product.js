const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
	name: String,
	price: Number,
	description: String,
	constituents: Array,
	image: Array,
	prescription: Boolean,
  usage: String,
  caution: String,
  tags: [ String ],
	similar: [{type: Schema.Types.ObjectId, ref: 'Product'}],
	quantity: Number,
	status: String
});

const Product = module.exports = mongoose.model('Product', ProductSchema);
