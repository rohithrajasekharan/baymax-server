const mongoose = require('mongoose');
const Hospital = require('./hospital-model');
const Schema = mongoose.Schema;

const doctorSchema = mongoose.Schema({
  name: String,
  qualifications: String,
  rating: Number,
  location: String,
  hasProfile: Boolean,
  visits: [{type: Schema.Types.ObjectId, ref: 'hospital'}],
  canBook: Boolean,
  image: String
});

const Doctor = module.exports =  mongoose.model('doctor', doctorSchema);
