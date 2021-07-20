import mongoose from 'mongoose';

const schema = new mongoose.Schema({
   name: { type: String, required: true },
   dimensionX: { type: Number, required: true },
   dimensionZ: { type: Number, required: true },
})

export default mongoose.model('Village', schema);
