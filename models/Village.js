import { Schema, model } from 'mongoose';

const schema = new Schema({
   name: {type: String, required: true},
   dimensionX: {type: Number, required: true},
   dimensionZ: {type: Number, required: true},
})

export default model('Village', schema);
