const express = require('express'),
	app = express(),
	path = require('path'),
	{ themes, languages, fonts, defaults } = JSON.parse(require('fs').readFileSync(`${__dirname}/config.json`));

app.use(require('cors')({ origin: '*' }));
app.use(express.static(path.join(__dirname, '/public')));

app.set('views', path.join(__dirname, '/public'));
app.set('view engine', 'ejs');

['image', 'fonts', 'languages', 'themes'].forEach(key => app.get(`/api/${key}`, require(`./api/${key}`)));

app.get('/private/preview', (req, res, next) => {
	const { theme = defaults.theme, language = 'javascript', backgroundColor = 'white', backgroundImage = '', 
		hideButtons = false, showLineNumbers = false, padding = defaults.padding, showBackground = true, code = defaults.code } = req.query;
	res.render('preview', { 
		theme,
		language,
		backgroundColor,
		backgroundImage,
		hideButtons,
		showLineNumbers,
		padding,
		showBackground,
		code
	 });
});

app.use((req, res, next) => {
	if (process.env.NODE_ENV !== 'production')
		console.info(`Status: ${res.statusCode}\t\t URL: ${res.req.path}`);
	next();
});

app.listen(process.env.PORT, () => console.info(`Your app is listening on port ${process.env.PORT}`));