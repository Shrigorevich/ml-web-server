const {Schema, model, Types} = require('mongoose');
const mongoose = require('mongoose');

const schema = new Schema({
   templateName: {type: String, required: true},
   x: {type: Number, required: true},
   y: {type: Number, required: true},
   type: {type: String, required: true},
   sign: {type: [String], default: "CIVIL", required: true}
})

module.exports = model('TemplateCell', schema);
