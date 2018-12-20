const mongoose = require('mongoose');
const Doctor = require('./doctor-model');
const Schema = mongoose.Schema;

const hospitalSchema = mongoose.Schema({
  name: String,
  description: String,
  rating: Number,
  address: String,
  long: Number,
  lat: Number,
  placeid: String,
  location: String,
  benefits: String,
  integrated: Boolean,
  doctors: [{type: Schema.Types.ObjectId, ref: 'doctor'}]
});

const Hospital = module.exports =  mongoose.model('hospital', hospitalSchema);
