const request = require('request');
const cheerio = require('cheerio');

const BASE_URL = 'https://www.soundboard.com/sb/';

module.exports = board => {

	const options = {
		url: BASE_URL+board,
		timeout: 10000
	}

	return new Promise((resolve, reject) => {
		request(options, (err, res, body) => {
			if  (err) return reject(err);

			const $ = cheerio.load(body);
			const result = [];
			
			$('#playlist .trackli').each(function(i, elem) {
				let title = $(this).find('.tracktitle span').html();
				result.push(title);
			})
			
			resolve(result);
		});
	});
}
