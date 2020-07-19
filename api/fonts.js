export default (request, response) => {
	console.log('');
	console.log('🎉 ', request.url);
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.send([
    'Inconsolata.ttf',
    'NotoColorEmoji.ttf',
  ]);
};
