const Discord = require('discord.js');
const config = require('./config/bot.js');
const tts = require('google-tts-api');
const instants = require('./myinstants-api.js');

const bot = new Discord.Client();
let voiceChannel = null;
let voiceConnection = null;

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
			case 'join': {
				voiceConnection = await joinChannel(message);
				break;
			}
			case 'leave': {
				leaveChannel();
				break;
			}
			case 'say': {
				await playTextToSpeech(message, args.join(' '));
				break;
			}
			case 'instant': {
				if (args.length > 0) {
					await playInstant(message, args.join(' '));
				} else {
					await playInstant(message);
				}
				break;
			}
			default: break;
		}

		message.delete().catch(console.error);
	} catch (err) {
		console.error(err);
	}
});

bot.login(config.token);

function joinChannel(message) {
	voiceChannel = message.member.voiceChannel;
	if (!voiceChannel) return;
	
	return voiceChannel.join();
}

function leaveChannel () {
	voiceChannel.leave();
}

async function playTextToSpeech(message, sayMessage) {
	const url = await tts(sayMessage, 'en', 1);
	
	voiceConnection = await joinChannel(message);
	if (!voiceConnection) return;
	voiceConnection.playArbitraryInput(url);
}

async function playInstant(message, query) {
	const allInstants = query ? await instants(query) : await instants();

	if (allInstants.length <= 0) return message.channel.send('No matching instants found');

	const randomInstant = allInstants[Math.floor(Math.random()*allInstants.length)];
	message.channel.send('Playing instant: ' + randomInstant.title);

	voiceConnection = await joinChannel(message);
	if (!voiceConnection) return;
	voiceConnection.playArbitraryInput(randomInstant.url);
}
