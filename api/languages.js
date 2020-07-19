const languages = (JSON.parse(require('fs').readFileSync(`${__dirname}/../config.json`))).languages;
module.exports = (request, response) => {
	console.log('');
	console.log('🎉 ', request.url);
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.send(languages);
};
