'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var animalSchema = Schema({
    name: String,
    description: String,
    year: Number,
    image: String,
    user: {type: Schema.ObjectId, ref: 'user'}
});

module.exports = mongoose.model('Animal', animalSchema);
