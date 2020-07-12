const mongoose = require('mongoose');

const connectDB = async () => {
	const db = await mongoose.connect(process.env.DATABASE, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false
	});
};

module.exports = connectDB;
