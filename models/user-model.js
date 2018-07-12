const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Article = require('../models/article-model');
const Product = require('../models/product');
const Schema = mongoose.Schema;
const UserSchema = mongoose.Schema({
	name: String,
	email: {
		type: String,
		unique: true,
		sparse: true
	},
  password: String,
	isDoc: Boolean,
  googleId: String,
	facebookId: String,
	avatar: String,
  logintype: String,
	lasttimestamp: Date,
	articlebookmark: [{type: Schema.Types.ObjectId, ref: 'Article'}],
	questionbookmark: [{type: Schema.Types.ObjectId, ref: 'Question'}]
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){

	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByMail = function(email, callback) {
  const query = {email: email};
  User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch){
    if(err) throw err;
    callback(null, isMatch);
  });
}
