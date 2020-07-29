const express = require('express'),
	app = express(),
	path = require('path'),
	config = JSON.parse(require('fs').readFileSync(`${__dirname}/config.json`));

require('dotenv').config();

app.use(require('cors')({ origin: '*' }));
app.use(express.static(path.join(__dirname, '/public')));

app.set('views', path.join(__dirname, '/public'));
app.set('view engine', 'ejs');

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	next();
});

app.get('/api/image', require('./api/image'));

['languages', 'themes'].forEach(key => app.get(`/api/${key}`, (req, res, next) => {
	console.info('\n', '🎉 ', req.url);
	res.send(config[key]);
}));

app.get('/private/preview', (req, res, next) => res.render('preview', ({ 
	theme = config.defaults.theme, 
	language = config.defaults.language, 
	backgroundColor = config.defaults.backgroundColor, 
	backgroundImage = config.defaults.backgroundImage, 
	hideButtons = config.defaults.hideButtons, 
	showLineNumbers = config.defaults.showLineNumbers, 
	padding = config.defaults.padding, 
	showBackground = config.defaults.showBackground, 
	code = config.defaults.code,
	width = undefined
} = req.query)));

app.use((req, res, next) => {
	if (process.env.NODE_ENV !== 'production')
		console.info(`Status: ${res.statusCode}\t\t URL: ${res.req.path}`);
	next();
});

app.listen(process.env.PORT, () => console.info(`Your app is listening on port ${process.env.PORT}`));