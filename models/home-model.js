const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Article = require('./article-model');
const Product = require('./product');



const HomeSchema = mongoose.Schema({
    target: String,
    main: [{ type: String }],
    dailyReads: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
    videos: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
    recomProducts: [{ type: Schema.Types.ObjectId, ref: 'pharmaproduct' }]
});

const Email = module.exports = mongoose.model('Home', HomeSchema, 'home');