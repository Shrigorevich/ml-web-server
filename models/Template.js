const {Schema, model, Types} = require('mongoose');
const mongoose = require('mongoose');

const schema = new Schema({
   name: {type: String, required: true, unique: true},
   dimensionX: {type: Number, required: true},
   dimensionY: {type: Number, required: true}
});

module.exports = model('Template', schema);
