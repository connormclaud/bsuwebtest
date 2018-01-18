'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ItemsSchema = new Schema({
    name: {
        type: String,
        required: 'Kindly enter the name of the item'
    },
    Created_date: {
        type: Date,
        default: Date.now
    },
    price: {
        type: Number,
    },
    quantity: {
        type: Number,
    }
});

module.exports = mongoose.model('Items', ItemsSchema);