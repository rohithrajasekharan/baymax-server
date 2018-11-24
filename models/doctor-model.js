const mongoose = require('mongoose');
const Hospital = require('./hospital-model');
const Schema = mongoose.Schema;
var timingSchema = new Schema({
    name : String,
    id : [{type: Schema.Types.ObjectId, ref: 'hospital'}],
    av_days: [{type:Boolean}],
    timing: String
})
const doctorSchema = mongoose.Schema({
  name: String,
  qualifications: String,
  rating: Number,
  location: String,
  hasProfile: Boolean,
  visits: [{type: Schema.Types.ObjectId, ref: 'hospital'}],
  canBook: Boolean,
  image: String,
  speciality: [String],
  timing: [timingSchema]
});

const Doctor = module.exports =  mongoose.model('doctor', doctorSchema);
