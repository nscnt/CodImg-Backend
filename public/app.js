function injectStylesheetForTheme(stylesheetUrl) {
    let link = document.createElement('link');
    link.href = stylesheetUrl;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
}

function injectTheme(themeName) {
    injectStylesheetForTheme(`./prism-themes/prism-${themeName}.css`);
}

function getRandomColor() {
    return 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)';
}

const DEFAULTS = {
    FONT_SIZE: '13px',
    THEME: 'vsc-dark-plus',
    SHOW_BACKGROUND: true,
    BACKGROUND: getRandomColor(),
    BACKGROUND_PADDING_REM: "5",
};

const views = {
    code: document.querySelector('#code'),
    background: document.querySelector('.background'),
    codeContainer: document.querySelector('#code-container'),
    windowHeader: document.querySelector('#header'),
};

const queryParams = new URLSearchParams(window.location.search);

const options = {
    code: queryParams.get('code'),
    language: queryParams.get('language'),
    theme: queryParams.get('theme') || DEFAULTS.THEME,
    background: {
        image: queryParams.get('background-image'),
        color: queryParams.get('background-color') || DEFAULTS.BACKGROUND,
        padding: queryParams.get('padding') || DEFAULTS.BACKGROUND_PADDING_REM,
        enabled: queryParams.has('show-background') ? queryParams.get('show-background') === 'true' : DEFAULTS.SHOW_BACKGROUND,
    },
    showLineNumbers: queryParams.has('line-numbers') && queryParams.get('line-numbers') === 'true',
};

console.info(options);

if (options.language) {
    views.codeContainer.classList.add(`language-${options.language}`);
}

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
    views.background.style.padding = "0px";
}

injectTheme(options.theme);
injectStylesheetForTheme('./base.css');

if (!options.showLineNumbers) {
    views.codeContainer.classList.remove('line-numbers');
}

if (options.code) {
    views.code.textContent = options.code;
}

window.LOAD_COMPLETE = true;