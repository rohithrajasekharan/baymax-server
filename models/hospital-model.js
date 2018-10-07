const mongoose = require('mongoose');

const hospitalSchema = mongoose.Schema({
  name: String,
  description: String,
  rating: Number,
  address: String,
  long: Number,
  lat: Number,
  benefits: String
});

const Hospital = module.exports =  mongoose.model('hospital', hospitalSchema);
