const Discord = require('discord.js');
const config = require('./config/bot.js');
const tts = require('google-tts-api');
const instants = require('./myinstants-api.js');
const fs = require('fs');

const bot = new Discord.Client();

let voiceChannel = null;
let voiceConnection = null;

// Configure bot
bot.on('ready', () => {
	console.log('Bot is running...');
	bot.user.setActivity('K is een Paaz');
});

bot.on('message', async message => {
	if (message.author.bot || !message.guild) return;
	if (message.content.indexOf(config.prefix) !== 0) return;
	
	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	
	if (!voiceChannel) {
		voiceChannel = message.member.voiceChannel;
	}
	
	try {
		switch(command) {
			// Voice channel interaction
			case 'join': {
				voiceConnection = await joinChannel(message);
				break;
			}
			case 'leave': {
				leaveChannel();
				break;
			}
			// Text to Speech
			case 'say': {
				await playTextToSpeech(message, args.join(' '));
				break;
			}
			case 'eng': {
				await playTextToSpeech(message, args.join(' '), 'en');
				break;
			}
			case 'rus': {
				await playTextToSpeech(message, args.join(' '), 'ru');
				break;
			}
			case 'afr': {
				await playTextToSpeech(message, args.join(' '), 'af');
				break;
			}
			// Instants from myinstants.com
			case 'ins': {
				if (args.length > 0) {
					await playInstant(message, args.join(' '));
				} else {
					await playInstant(message);
				}
				break;
			}
			case 'clue': {
				sendRandomClue(message);
				break;
			}
			default: break;
		}

		message.delete().catch(console.error);
	} catch (err) {
		console.error(err);
	}
});

// Start bot
bot.login(config.token);

// Command functions
function joinChannel(message) {
	voiceChannel = message.member.voiceChannel;
	if (!voiceChannel) return;
	
	return voiceChannel.join();
}

function leaveChannel () {
	voiceChannel.leave();
}

async function playTextToSpeech(message, sayMessage, language = 'nl') {
	let originalMessage = sayMessage;
	if (sayMessage.length > 200) {
		sayMessage = 'Vuile paaz denk je dat ik zo\'n lange tekst ga voorlezen...';
	}

	const url = await tts(sayMessage.replace('paaz', 'paas'), language, 1);
	
	message.channel.send(originalMessage);
	await playSoundFromUrl(message, url);
}

async function playInstant(message, query) {
	const allInstants = query ? await instants(query) : await instants();

	if (allInstants.length <= 0) {
		return message.channel.send('No matching instants found');
	}

	const randomInstant = allInstants[Math.floor(Math.random()*allInstants.length)];
	message.channel.send('Playing instant: ' + randomInstant.title);

	await playSoundFromUrl(message, randomInstant.url);
}

async function playSoundFromUrl(message, url) {
	voiceConnection = await joinChannel(message);
	if (!voiceConnection) return;
	
	const dispatcher = voiceConnection.playArbitraryInput(url);
	dispatcher.on('end', end => {
		leaveChannel();
	});
}

function sendRandomClue(message) {
	const dir = '../clue/';
	const files = fs.readdirSync(dir);
	const fileName = files[Math.floor(Math.random()*files.length)];
	message.channel.send(fileName, {
		file: dir+fileName
	});
}