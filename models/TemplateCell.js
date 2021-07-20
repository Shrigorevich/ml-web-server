import mongoose from 'mongoose';

const schema = new mongoose.Schema({
   templateName: { type: String, required: true },
   x: { type: Number, required: true },
   y: { type: Number, required: true },
   type: { type: String, required: true },
   purpose: { type: String, required: true }
})

export default mongoose.model('TemplateCell', schema);
