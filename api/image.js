/* eslint-disable no-console, no-undef */
const chromium = require('chrome-aws-lambda'),
  Gists = require('gists'),
	{ performance } = require('perf_hooks'),
	beautify = require('js-beautify'),
  production = process.env.NODE_ENV === 'production',
	{ themes, languages, fonts, defaults } = JSON.parse(require('fs').readFileSync(`${__dirname}/../config.json`)),
	toSeconds = (ms) => (ms / 1000).toFixed(2),
	sendErrorResponse = (res, err) => !console.info('❌ ', err.message) && res.status(400).send(err),
	trimLineEndings = (text) => text.split('\n').map((line) => line.trimEnd()).join('\n'),
	clamp = (val, min, max = Infinity, whenNaN) => isNaN(val = parseFloat(val)) ? whenNaN || min : Math.min(Math.max(min, val), max);

require('dotenv').config();

const gists = new Gists();

module.exports = async (request, response) => {
	response.setHeader('Access-Control-Allow-Origin', '*');
	try {
		const hostname = production ? 'https://codimg.xyz' : 'http://localhost:3000';
		const startTime = performance.now();
		const settings = { ...request.query };

		!production && console.info('\n', '🎉 ', request.url);
		!production && console.info('🛠 ', `Environment: ${process.env.NODE_ENV}`);
    !production && console.info('🛠 ', `Hostname: ${hostname}`);
    
    if (settings.gistId) {
      !production && console.info('🛠 ', `Gist ID: ${settings.gistId}`);
      try {
        const gist = (await gists.get(settings.gistId)).body;
        settings.code = Object.values(gist.files)[0].content;
      } catch (err) {
        return sendErrorResponse(response, {
          message: 'Gist cannot be found'
        })
      }
    }

		if (typeof settings.code !== 'string') {
			return sendErrorResponse(response, {
				message: 'Code snippet missing'
			});
		}

		if (!languages.includes(settings.language)) {
			return sendErrorResponse(response, {
				message: !settings.language ? 'Language not specified' : `Unknown language '${settings.language}'`,
				languages
			});
		}

		if (settings.theme && !themes.includes(settings.theme)) {
			return sendErrorResponse(response, {
				message: `Unknown theme '${settings.theme}'`,
				themes
			});
		}

		!settings.theme && (settings.theme = defaults.theme);
		settings.lineNumbers = settings.lineNumbers === 'true';
		settings.scaleFactor = clamp(settings.scaleFactor, 1, 5, defaults.viewport.scaleFactor);
		settings.width = isNaN(settings.width = Math.min(Math.abs(settings.width), 1920)) ? defaults.viewport.width : settings.width;
		!settings.backgroundColor && (settings.backgroundColor = '');
		!settings.backgroundImage && (settings.backgroundImage = '');
    settings.showBackground = settings.showBackground !== 'false';
    settings.hideButtons = settings.hideButtons === 'true';
    settings.padding = clamp(settings.padding, 0, 10);

		!production && console.info('🛠 ', `Theme: ${settings.theme}`);
		!production && console.info('🛠 ', `Language: ${settings.language}`);
		!production && console.info('🛠 ', `Line Numbers: ${settings.lineNumbers}`);
		!production && console.info('🛠 ', `Scale Factor: ${settings.scaleFactor}`);
		!production && console.info('🛠 ', `Width: ${settings.width}`);
		!production && console.info('🛠 ', `Background Color: ${settings.backgroundColor}`);
		!production && console.info('🛠 ', `Background Image: ${settings.backgroundImage}`);
		!production && console.info('🛠 ', `Show Background: ${settings.showBackground}`);
		!production && console.info('🛠 ', `Hide Buttons: ${settings.hideButtons}`);
		!production && console.info('🛠 ', `Padding: ${settings.padding}`);

		// eslint-disable-next-line camelcase
		settings.trimmedCodeSnippet = trimLineEndings(settings.code);

		const queryParams = new URLSearchParams();
		queryParams.set('theme', settings.theme);
		queryParams.set('language', settings.language);
		queryParams.set('lineNumbers', settings.lineNumbers);
		queryParams.set('code', settings.trimmedCodeSnippet);
		queryParams.set('showBackground', settings.showBackground);
		queryParams.set('hideButtons', settings.hideButtons);
		if (settings.backgroundImage) { queryParams.set('backgroundImage', settings.backgroundImage); }
		if (settings.backgroundColor) { queryParams.set('backgroundColor', settings.backgroundColor); }
		if (settings.padding) { queryParams.set('padding', settings.padding); }

		const pageUrl = `${hostname}/code.html?${queryParams.toString()}`;

		await Promise.all(fonts.map((font) => {
			const fontUrl = `${hostname}/fonts/${font}`;
			!production && console.info('🛠 ', `Loading ${fontUrl}`);
			return chromium.font(fontUrl);
		}));

		console.info('🛠 ', 'Preview Page URL', pageUrl);
		const browser = await chromium.puppeteer.launch({
      args: chromium.args,
			defaultViewport: {
        deviceScaleFactor: settings.scaleFactor,
        width: settings.width,
        height: defaults.viewport.height,
        isMobile: false
      },
			executablePath: await chromium.executablePath,
			headless: true,
			ignoreHTTPSErrors: true
		});
    const page = await browser.newPage();
    await page.goto(pageUrl);
		await page.waitForSelector('#container') && await page.waitForSelector('#window');
		await page.evaluate(() => {
			const codeContainer = document.getElementById('code-container');
			const windowHeader = document.getElementById('header');
			if (codeContainer && windowHeader) {
				windowHeader.style.background = window
					.getComputedStyle(codeContainer, null)
					.getPropertyValue('background');
			}
		});
		const image = await (await page.$(!settings.showBackground ? '#window' : '#container')).screenshot();
		console.info('⏰ ', `Operation finished in ${toSeconds(performance.now() - startTime)} seconds`);
		response.setHeader('Content-Type', 'image/png');
		response.status(200).send(image);
		return await page.close() && await browser.close();
	} catch (err) {
		console.error('❌ ', 'Uncaught Exception', err);
		return sendErrorResponse(response, {
			message: 'Unexpected Error'
		});
	}
};
