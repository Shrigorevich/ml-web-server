import { Schema, model } from 'mongoose';

const schema = new Schema({
   owner: {type: String, required: true},
   x: {type: Number, required: true},
   y: {type: Number, required: true},
   type: {type: String, required: true},
   purpose: {type: String, required: true}
})

export default model('VillageCell', schema);
