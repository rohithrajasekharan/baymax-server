const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const QuerySchema = mongoose.Schema({
	name: String,
  mail: String,
  content: String
});

const Query = module.exports = mongoose.model('Query', QuerySchema);
