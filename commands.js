const tts = require('google-tts-api');
const fs = require('fs');
const instants = require('./myinstants-api.js');
const config = require('./config/bot.js');

let voiceChannel = null;
let voiceConnection = null;

module.exports = [
    {
        command: 'help', description: 'Show commands',
        execute: async (message, args) => showHelpInformation(message)
    },
    {
        command: 'join', description: 'Join voice channel',
        execute: async (message, args) => voiceConnection = await joinChannel(message)
    },
    {
        command: 'leave', description: 'Leave voice channel',
        execute: (message, args) => leaveChannel()
    },
    {
        command: 'say', description: 'Speak in dutch',
        execute: async (message, args) =>  await playTextToSpeech(message, args.join(' '))
    },
    {
        command: 'eng', description: 'Speak in english',
        execute: async (message, args) => await playTextToSpeech(message, args.join(' '), 'en')
    },
    {
        command: 'rus', description: 'Speak in russian',
        execute: async (message, args) => await playTextToSpeech(message, args.join(' '), 'ru')
    },
    {
        command: 'ins', description: 'Play a random instant from myinstants.com',
        execute: async (message, args) => {
            if (args.length > 0) {
                await playInstant(message, args.join(' '));
            } else {
                await playInstant(message);
            }
        }
    },
    {
        command: 'clue', description: 'Show a random clue scroll',
        execute: (message, args) => sendRandomClue(message)
    }
];

// Command functions
function showHelpInformation(message) {
    message.channel.send("Binnenkort komt hier de helpinformatie pazen, prefix = " + config.prefix);
}

function joinChannel(message) {
    voiceChannel = message.member.voiceChannel;
	if (!voiceChannel) return;
	
	return voiceChannel.join();
}

function leaveChannel () {
    if (voiceChannel) voiceChannel.leave();
}

async function playTextToSpeech(message, sayMessage, language = 'nl') {
	let originalMessage = sayMessage;
	if (sayMessage.length > 200) {
		sayMessage = 'Vuile paaz denk je dat ik zo\'n lange tekst ga voorlezen...';
	}

	const url = await tts(sayMessage.replace('paaz', 'paas'), language, 1);
	
	message.channel.send('['+language+'] '+originalMessage);
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