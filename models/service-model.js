const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = mongoose.Schema({
  status:String,
  by:String,
  service:String,
  Name:String,
  phone:String,
  place:String,
  hospital:String,
  additional:String,
});

const Service = module.exports =  mongoose.model('servicereq', serviceSchema,'service_requests');