const mongoose = require('mongoose');

const VoteSchema = mongoose.Schema({
    userId:String,
    answerId:String,
    type:String
});


const Vote = module.exports = mongoose.model('Vote', VoteSchema,'votes');