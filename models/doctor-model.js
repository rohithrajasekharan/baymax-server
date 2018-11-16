const mongoose = require('mongoose');
const Hospital = require('../hospital-model');

const doctorSchema = mongoose.Schema({
  name: String,
  qualifications: String,
  rating: Number,
  hasProfile: Boolean,
  visits: [{type: Schema.Types.ObjectId, ref: 'Hospital'}],
  canBook: Boolean,
  image: String
});

const Doctor = module.exports =  mongoose.model('doctor', doctorSchema);
