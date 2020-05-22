const express = require('express');
const request = require('request');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'static')));

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	next();
});
app.get('/podcast_data', (req, res) => {
	url = `https://itunes.apple.com/lookup?id=${req.query.id}`;
	request({ url }, (error, response, body) => {
		if (error || response.statusCode !== 200) {
			return res.status(500).json({ type: 'error', message: err.message });
		}

		res.json(JSON.parse(body));
	});
});
console.log(__dirname);
// app.get('/podcast', (req, res) => {
// 	// res.sendFile(path.join(__dirname + '/index.html'));
// 	res.sendFile(path.join(__dirname + './test.html'));
// });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));

app.get('/podcast', (req, res) => {
	// res.sendFile(path.join(__dirname + '/index.html'));
	res.sendFile(path.join(__dirname + '/static/index.html'));
});
