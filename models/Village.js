import mongoose from 'mongoose';

const schema = new mongoose.Schema({
   name: { type: String, required: true },
   dimensionX: { type: Number, required: false },
   dimensionZ: { type: Number, required: false },
   state: { type: String, default: "DRAFT", required: true }
})

export default mongoose.model('Village', schema);
