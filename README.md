# SVR Paaz Discord Bot

## Install

To prepare the install on ubuntu 16.04 run the following commands.
- `$ sudo apt install autotools-dev`
- `$ sudo apt install autoconf`
- `$ sudo apt install libtool-bin`
- `$ sudo apt install build-essential`
- `$ sudo apt install ffmpeg`

You will need node and npm to run the bot.
- `$ curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -`
- `$ sudo apt install -y nodejs`

And then finally to install the bot
- `$ cd /folder/to/install/bot `
- `$ sudo git clone https://github.com/GoosvandenBekerom/svrpaaz-discord-bot`
- `$ npm install`

## Run the bot
Finally you should configure your discord bot account to use this bot.  
In the root folder create a folder called `config`, and in there create a file called `bot.js`.

The contents should look somewhat like this:
```js
module.exports = {
    token: 'your-bot-account-token',
    prefix: ":"
}
```

Run to following command to run the bot
- `$ npm start`
