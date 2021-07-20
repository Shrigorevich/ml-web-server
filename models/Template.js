import mongoose from 'mongoose';

const schema = new mongoose.Schema({
   name: { type: String, required: true, unique: true },
   dimensionX: { type: Number, required: true },
   dimensionY: { type: Number, required: true }
});

export default mongoose.model('Template', schema);
