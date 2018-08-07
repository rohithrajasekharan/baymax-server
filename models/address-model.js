const mongoose = require('mongoose');
const User = require('./user-model');
const Schema = mongoose.Schema;

const addressSchema = mongoose.Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
  addr: String,
  pincode: Number
});

const Address = module.exports =  mongoose.model('user_addresse', addressSchema);
