const request = require('request');
const cheerio = require('cheerio');

const BASE_URL = 'https://www.myinstants.com';

module.exports = query => {

	let location = query ? '/search/?name='+query : '/index/nl';
	const options = {
		url: BASE_URL+location,
		timeout: 10000
	}

	return new Promise((resolve, reject) => {
		request(options, (err, res, body) => {
			if  (err) return reject(err);

			const $ = cheerio.load(body);
			const result = [];
			$('.instant').each(function(i, elem) {
				let link = $(this).children('.small-button').attr('onmousedown');
				let item = {
					title: $(this).text().replace(/\n+/g, '').replace(/<[^>]*>/g, ''),
					url: BASE_URL+link.replace(/play\('|'\)/g, '')
				}
				result.push(item);
			});
			resolve(result);
		});
	});
}
