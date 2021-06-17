const {Schema, model, Types} = require('mongoose');
const mongoose = require('mongoose');

const schema = new Schema({
   nickname: {type: String, required: true, unique: true},
   email: {type: String, required: true, unique: true},
   password: {type: String, required: true},
   date: {type: Date, default: Date.now},
   skin: {type: String, default: "Default"},
   paid: {type: Boolean, default: false},
   ips: {type: [String], required: true}
})

module.exports = model('User', schema);
