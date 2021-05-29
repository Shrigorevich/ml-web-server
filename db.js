const mongoose = require('mongoose');
const dotenv = require('dotenv')

dotenv.config()

const connectDB = async () => {
	try {
		await mongoose.connect("mongodb://localhost:27017", {
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

module.exports = connectDB;