import mongoose from 'mongoose';

const schema = new mongoose.Schema({
   name: { type: String, unique: true, required: true },
   dimensionX: { type: Number, required: false },
   dimensionZ: { type: Number, required: false },
   status: { type: String, default: "DRAFT", required: true }
}, { collection: "villages" })

export default mongoose.model('Village', schema);
