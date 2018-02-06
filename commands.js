const tts = require('google-tts-api');
const fs = require('fs');
const instants = require('./myinstants-api.js');
const config = require('./config/bot.js');

let voiceChannel = null;
let voiceConnection = null;

module.exports = commands = [
    {
        command: 'help', options: "", description: 'List all commands',
        execute: async (message, args) => showHelpInformation(message)
    },
    {
        command: 'join', options: "", description: 'Join current voice channel',
        execute: async (message, args) => voiceConnection = await joinChannel(message)
    },
    {
        command: 'leave', options: "", description: 'Leave current voice channel',
        execute: (message, args) => leaveChannel()
    },
    {
        command: 'say', options: "[text]", description: 'Speak out [text] in Dutch',
        execute: async (message, args) =>  await playTextToSpeech(message, args.join(' '))
    },
    {
        command: 'eng', options: "[text]", description: 'Speak out [text] in English',
        execute: async (message, args) => await playTextToSpeech(message, args.join(' '), 'en')
    },
    {
        command: 'rus', options: "[text]", description: 'Speak out [text] in Russian',
        execute: async (message, args) => await playTextToSpeech(message, args.join(' '), 'ru')
    },
    {
        command: 'ger', options: "[text]", description: 'Speak out [text] in German',
        execute: async (message, args) => await playTextToSpeech(message, args.join(' '), 'de')
    },
    {
        command: 'ins', options: "[search]", description: 'Play a random instant sound from myinstants.com',
        execute: async (message, args) => {
            if (args.length > 0) {
                await playInstant(message, args.join(' '));
            } else {
                await playInstant(message);
            }
        }
    },
    {
        command: 'clue', options: "[novoice]", description: 'Show a random clue scroll and speak out its name in Dutch',
        execute: async (message, args) => await sendRandomClue(message, args)
    }
];

// Command functions
function showHelpInformation(message) {
    let helpString = "```markdown\n# Paaz bot commands\n\n" + "prefix = " + config.prefix + "\n\n";

    for (let i = 0; i < commands.length; i++) {
        let c = commands[i];
        helpString += config.prefix + c.command + " " + c.options + "\n" + c.description + "\n\n";
    }

    message.channel.send(helpString + "\n```");
}

function joinChannel(message) {
    voiceChannel = message.member.voiceChannel;
	if (!voiceChannel) return;
	
	return voiceChannel.join();
}

function leaveChannel () {
    if (voiceChannel) voiceChannel.leave();
}

async function playTextToSpeech(message, sayMessage, language = 'nl', displayMessage = true) {
	let originalMessage = sayMessage;
	if (sayMessage.length > 200) {
		sayMessage = 'Vuile paaz denk je dat ik zo\'n lange tekst ga voorlezen...';
	}
    
	const url = await tts(sayMessage.replace('paaz', 'paas'), language, 1);
	
	if (displayMessage) message.channel.send('['+language+'] '+originalMessage);
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

async function sendRandomClue(message, args) {
	const dir = '../clue/';
	const files = fs.readdirSync(dir);
    const fileName = files[Math.floor(Math.random()*files.length)];

    if (args[0] != 'novoice') await playTextToSpeech(message, fileName, 'nl', false);

	message.channel.send(fileName, {
		file: dir+fileName
	});
}