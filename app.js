const Discord = require('discord.js');
const config = require('./config/bot.js');
const fs = require('fs');
const tts = require('google-tts-api');

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
	
	try {
		if (command == 'join') {
			voiceConnection = await joinChannel(message)
			console.log('Succesfully joined channel: ' + voiceChannel);
		}
		
		if (command == 'leave') {
			if (!voiceChannel) return;
			voiceChannel.leave();
		}
		
		if (command == 'say') {
			const sayMessage = args.join(' ');
			message.delete().catch(console.error);
			message.channel.send(sayMessage);
			// TODO: make text to speech say this message
		}
	} catch (err) {
		console.log(err);
	}
});

bot.login(config.token);

function joinChannel(message) {
	voiceChannel = message.member.voiceChannel;
	if (!voiceChannel) return;
	
	return voiceChannel.join();
}
