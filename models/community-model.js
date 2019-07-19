const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommunitySchema = mongoose.Schema({
    Name:String,
    postCount:Number,
    memberCount:Number,
    image:String,
    desription:String
});

const Community = module.exports = mongoose.model('Community', CommunitySchema,'Communities');