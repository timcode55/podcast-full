const mongoose = require('mongoose');

let db;

let connectionString =
	'mongodb+srv://iRatingUser:XbeycTPF2n5nqVrY@cluster0-b5bni.mongodb.net/iRatings?retryWrites=true&w=majority';
mongoose
	.connect(connectionString, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false
	})
	.then(() => {
		console.log('DB connection was successful!');
		var currentPath = process.cwd();
		// console.log(currentPath);
		// app.listen(5000);
	});
