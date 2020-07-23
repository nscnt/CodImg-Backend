const defaults = {
		fontSize: 13,
		theme: 'vsc-dark-plus',
		showBackground: true,
		backgroundColor: `hsla(${Math.random() * 360}, 100%, 50%, 1)`,
		padding: 5
}, background = document.getElementById('container')
codeView = document.getElementById('code-container'),
queryParams = new URLSearchParams(window.location.search),
injectTheme = (theme) => {
	const link = document.createElement('link');
  link.href = `./prism-themes/prism-${theme}.css`;
	link.rel = 'stylesheet';
	document.head.appendChild(link)
};

const options = {
code: queryParams.get('code'),
language: queryParams.get('language'),
theme: queryParams.get('theme') || defaults.theme,
background: {
		image: queryParams.get('backgroundImage'),
		color: queryParams.get('backgroundColor'),
		padding: queryParams.get('padding') || defaults.padding,
		enabled: queryParams.has('showBackground') ? queryParams.get('showBackground') === 'true' : defaults.showBackground
},
showLineNumbers: queryParams.has('lineNumbers') && queryParams.get('lineNumbers') === 'true',
hideButtons: queryParams.has('hideButtons') && queryParams.get('hideButtons') === 'true',
};

options.language && codeView.classList.add(`language-${options.language}`);
options.showLineNumbers && codeView.classList.add('line-numbers');
options.hideButtons && (document.getElementById('header').style.display = 'none');
document.getElementById('code').textContent = options.code;
background.style.padding = `${options.background.enabled ? options.background.padding : 0}rem`;

injectTheme(options.theme);

if (options.background.enabled) {
if (options.background.color)
		background.style.backgroundColor = options.background.color;
else if (options.background.image)
		background.style.backgroundImage = options.background.image;
else 
		background.style.backgroundColor = defaults.backgroundColor;
}
