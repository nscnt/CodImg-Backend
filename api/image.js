const chromium = require('chrome-aws-lambda'),
  { performance } = require('perf_hooks'),
  beautify = require('js-beautify'),
  fs = require('fs'),
  production = process.env.NODE_ENV === 'production',
  { themes, languages, fonts, defaults } = JSON.parse(fs.readFileSync(__dirname+"/../config.json")),
  toSeconds = (ms) => (ms / 1000).toFixed(2),
  sendErrorResponse = (res, err) => res.status(400).send(err),
  trimLineEndings = (text) => text.split('\n').map((line) => line.trimEnd()).join('\n');

  module.exports = async (request, response) => {
  response.setHeader('Access-Control-Allow-Origin', '*')
	try {
		const hostname = production ? 'https://codimg.xyz' : 'http://localhost:3000';
    const startTime = performance.now();

		console.info('\n', '🎉 ', request.url);
		console.info('🛠 ', `Environment: ${process.env.NODE_ENV}`);
		console.info('🛠 ', `Rendering Method: Puppeteer, Chromium headless`);
		console.info('🛠 ', `Hostname: ${hostname}`);

		let theme = request.query['theme'] || themes[0];
		let language = request.query['language'];
		let lineNumbers = request.query['line-numbers'] || 'false';
		let backgroundPadding = request.query['padding'] || '';
		let backgroundColor = request.query['background-color'] || '';
		let backgroundImage = request.query['background-image'] || '';
		let showBackground = request.query['show-background'] || 'true';
		let code = request.query['code'] || request.body;
		let width = defaults.viewport.width;
		let scaleFactor = defaults.viewport.deviceScaleFactor;

		if (typeof code != 'string') {
			console.info('❌ ', 'Code snippet missing');
			return sendErrorResponse(response, {
				message: 'Code snippet missing, please include it in the request body',
			});
		}

		if (!language || !languages.includes(language)) {
      const message = !language ? 'Language not specified' : `Unknown language '${language}'`;
			console.info('❌ ', message);
			return sendErrorResponse(response, {
				message,
				languages,
			});	
    }

		if (themes.indexOf(theme) === -1) {
			console.info('❌ ', `Unknown theme '${theme}'`);
			sendErrorResponse(response, {
				message: `Unknown theme: '${theme}'`,
				availableThemes: themes,
			});
			return;
    }
    
		if (backgroundPadding) {
			try {
				let padding = parseInt(backgroundPadding);
				backgroundPadding = Math.min(Math.max(0, padding), 10); // Make sure number is in range between 1-10
			} catch (error) {
				backgroundPadding = '';
			}
		}

		try {
			scaleFactor =
				parseInt(request.query['scale']) ||
				defaults.viewport.deviceScaleFactor;
			scaleFactor = Math.min(Math.max(1, scaleFactor), 5); // Make sure number is in range between 1-5
		} catch (e) {
			scaleFactor = defaults.viewport.deviceScaleFactor;
		}

		console.info('🛠 ', `Theme: ${theme}`);
		console.info('🛠 ', `Language: ${language}`);
		console.info('🛠 ', `Line Numbers: ${lineNumbers}`);
		console.info('🛠 ', `Scale Factor: ${scaleFactor}`);
		console.info('🛠 ', `Width: ${width}`);
		console.info('🛠 ', `Background Color: ${backgroundColor}`);
		console.info('🛠 ', `Background Image: ${backgroundImage}`);
		console.info('🛠 ', `Show Background: ${showBackground}`);
		console.info('🛠 ', `Background Padding: ${backgroundPadding}`);

		try {
			width = Math.min(Math.abs(parseInt(request.query['width'])), 1920);
		} catch (exception) {
			console.warn('Invalid width', exception);
			width = defaults.viewport.width;
		}

		let trimmedCodeSnippet =
			language == 'javascript'
				? beautify(code, { indent_size: 2, space_in_empty_paren: true })
				: trimLineEndings(code);

		let queryParams = new URLSearchParams();
		theme && queryParams.set('theme', theme);
		language && queryParams.set('language', language);
		queryParams.set('line-numbers', lineNumbers);
		queryParams.set('code', trimmedCodeSnippet);
		queryParams.set('background-image', backgroundImage);
		queryParams.set('background-color', backgroundColor);
		queryParams.set('show-background', showBackground);
		queryParams.set('padding', backgroundPadding);

		const queryParamsString = queryParams.toString();
		const pageUrl = `${hostname}/code.html?${queryParamsString}`;

		fonts.forEach(async (font) => {
			const fontUrl = `${hostname}/fonts/${font}`;
			console.info('🛠 ', `Loading ${fontUrl}`);
			await chromium.font(fontUrl);
		});

		console.info('🛠 ', 'Preview Page URL', pageUrl);
		let browser = await chromium.puppeteer.launch({
			args: chromium.args,
			defaultViewport: chromium.defaultViewport,
			executablePath: await chromium.executablePath,
			headless: true,
			ignoreHTTPSErrors: true,
		});
		const page = await browser.newPage();
		await page.goto(pageUrl);
		await page.setViewport({
			deviceScaleFactor: scaleFactor,
			width: width || defaults.viewport.width,
			height: defaults.viewport.height,
			isMobile: false,
		});
    await page.waitForSelector('#container')
		await page.evaluate(() => {
			let background = '';
			const codeContainer = document.getElementById('code-container');
			const windowHeader = document.getElementById('header');
			if (codeContainer && windowHeader) {
				background = window
					.getComputedStyle(codeContainer, null)
					.getPropertyValue('background');
				windowHeader.style.background = background;
			}
			return background;
		});
		var codeView = await page.$(
			showBackground == 'false' || backgroundPadding == '0'
				? '#window'
				: '#container'
		);
		const image = await codeView.screenshot();
		console.info('⏰ ', `Operation finished in ${toSeconds(performance.now() - startTime)} seconds`);
		response.setHeader('Content-Type', 'image/png');
		response.status(200).send(image);
		await page.close();
		await browser.close();
	} catch (e) {
		console.error('❌ ', 'Uncaught Exception', e);
	}
};