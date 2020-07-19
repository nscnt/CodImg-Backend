const fonts = (JSON.parse(require('fs').readFileSync(`${__dirname}/../config.json`))).fonts;
module.exports = (request, response) => {
	console.log('');
	console.log('🎉 ', request.url);
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.send(fonts);
};
