const themes = (JSON.parse(require('fs').readFileSync(`${__dirname}/../config.json`))).themes;
module.exports = (request, response) => {
	console.log('');
	console.log('🎉 ', request.url);
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.send(themes);
};
