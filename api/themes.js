export default (request, response) => {
	console.log('');
	console.log('🎉 ', request.url);
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.send([
		'a11y-dark',
		'atom-dark',
		'base16-ateliersulphurpool.light',
		'cb',
		'darcula',
		'default',
		'dracula',
		'duotone-dark',
		'duotone-earth',
		'duotone-forest',
		'duotone-light',
		'duotone-sea',
		'duotone-space',
		'ghcolors',
		'hopscotch',
		'material-dark',
		'material-light',
		'material-oceanic',
		'nord',
		'pojoaque',
		'shades-of-purple',
		'synthwave84',
		'vs',
		'vsc-dark-plus',
		'xonokai',
	]);
};
