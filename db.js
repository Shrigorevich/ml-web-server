import mongoose from 'mongoose';
import { config } from 'dotenv';

config()

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true
		});
		console.log('MongoDB Connected...');
	} catch (err) {
		console.error(err.message);
		process.exit(1);
	}
};

export default connectDB;