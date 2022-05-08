const qrcode = require("qrcode-terminal");
const axios = require("axios");

const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const client = new Client({
    authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on('message', async message => {
    const user_message = message.body;
	switch(user_message) {
        case '!start':
          message.reply(`
            Hi, I'm a bot created by Madflows.exe!
            Enter *!help* to see the list of commands.
            `)
          break;
        case '!meme':
            const meme = await axios.get('https://meme-api.herokuapp.com/gimme')
            .then(res => res.data)

            const memeImg = await MessageMedia.fromUrl(meme.url);
            client.sendMessage(message.from, memeImg);
          break;
        case '!joke':
            const joke = await axios.get('https://v2.jokeapi.dev/joke/Any?safe-mode')
            .then(res => res.data)

            const jokeMsg = await client.sendMessage(message.from, joke.setup || joke.joke);

            (joke.delivery) ? setTimeout(() => jokeMsg.reply(joke.delivery), 5000) : null;
            break;

        case '!help':
            message.reply(`
            Here are the list of commands:
            
            *!start* - Start the bot
            *!meme* - Get a random meme
            *!joke* - Get a random joke
            *!help* - Show this message
            `)
            break;
        default:
          client.sendMessage(message.from, 'Unknown command');
      }
});

client.initialize();
