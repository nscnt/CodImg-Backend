/* eslint-disable no-undef */
function injectStylesheetForTheme(stylesheetUrl) {
	const link = document.createElement('link');
	link.href = stylesheetUrl;
	link.rel = 'stylesheet';
	document.head.appendChild(link);
}

function injectTheme(themeName) {
	injectStylesheetForTheme(`./prism-themes/prism-${themeName}.css`);
}

function getRandomColor() {
	return `hsla(${Math.random() * 360}, 100%, 50%, 1)`;
}

const defaults = {
	fontSize: '13px',
	theme: 'vsc-dark-plus',
	showBackground: true,
	backgroundColor: getRandomColor(),
	padding: '5'
};

const views = {
	code: document.querySelector('#code'),
	background: document.querySelector('.background'),
	codeContainer: document.querySelector('#code-container'),
	windowHeader: document.querySelector('#header')
};

const queryParams = new URLSearchParams(window.location.search);

const options = {
	code: queryParams.get('code'),
	language: queryParams.get('language'),
	theme: queryParams.get('theme') || defaults.theme,
	background: {
		image: queryParams.get('backgroundImage'),
		color: queryParams.get('backgroundColor') || defaults.backgroundColor,
		padding: queryParams.get('padding') || defaults.padding,
		enabled: queryParams.has('showBackground') ? queryParams.get('showBackground') === 'true' : defaults.showBackground
	},
	showLineNumbers: queryParams.has('lineNumbers') && queryParams.get('lineNumbers') === 'true'
};

options.language && views.codeContainer.classList.add(`language-${options.language}`);

if (options.background.enabled) {
	if (options.background.color) {
		views.background.style.background = options.background.color;
	}

	if (options.background.image) {
		views.background.style.backgroundImage = `url(${options.background.image})`;
	}

	if (options.background.padding) {
		views.background.style.padding = `${options.background.padding}rem`;
	}
} else {
	views.background.style.padding = '0px';
}

injectTheme(options.theme);
injectStylesheetForTheme('./base.css');

if (!options.showLineNumbers) {
	views.codeContainer.classList.remove('line-numbers');
}

if (options.code) {
	views.code.textContent = options.code;
}

if (options.borderRadius) {
	views.codeContainer.style['border-radius'] = `${borderRadius}px`;
}

window.LOAD_COMPLETE = true;
