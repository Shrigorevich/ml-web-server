const {Schema, model, Types} = require('mongoose');
const mongoose = require('mongoose');

const schema = new Schema({
   nickname: {type: String, required: true, unique: true},
   email: {type: String, required: true, unique: true},
   password: {type: String, required: true},
   date: {type: Date, default: Date.now},
   skin: {type: Number, default: 0},
   paid: {type: Boolean, default: false}
})

module.exports = model('User', schema);
