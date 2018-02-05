const Discord = require('discord.js');
const config = require('./config/bot.js');
const commands = require('./commands.js');

const bot = new Discord.Client();

// Configure bot
bot.on('ready', () => {
	console.log('Bot is running...');
	bot.user.setActivity('K is een Paaz');
});

bot.on('message', async message => {
	if (message.author.bot || !message.guild) return;
	if (message.content.indexOf(config.prefix) !== 0) return;
	
	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const commandText = args.shift().toLowerCase();
	
	try {
		const command = commands.find((comm) => comm.command == commandText);
		if (!command) return;

		command.execute(message, args);

		message.delete().catch(console.error);
	} catch (err) {
		console.error(err);
	}
});

// Start bot
bot.login(config.token);
