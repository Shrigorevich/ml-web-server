import mongoose from 'mongoose';

const schema = new mongoose.Schema({
   villageName: { type: String, required: true },
   address: { type: mongoose.Mixed, required: true },
   type: { type: String, required: true },
   purpose: { type: String, required: true }
})

export default mongoose.model('VillageCell', schema);
