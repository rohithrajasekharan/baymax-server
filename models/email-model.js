const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EmailSchema = mongoose.Schema({
  email: String
});

const Email = module.exports = mongoose.model('Email', EmailSchema);
