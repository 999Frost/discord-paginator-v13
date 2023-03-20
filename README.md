```js
const { Client, MessageEmbed } = require('discord.js')
const { DiscordPaginator } = require('../index')

const client = new Client({intents:3276799}) // Create a new Discord.js client instance
client.on('ready', () => {
    console.log("Ready on " + client.user?.tag) // Log when the client is ready
})

client.on('messageCreate', async message => {
    await message.guild.members.fetch({force:true, cache:true}) // Fetch the members of the guild to ensure they are cached
    if(message.content === "!embeds") { // If the message content is "!embeds"
        const embeds = [
            new MessageEmbed()
                .setTitle('Page 1')
                .setDescription('This is page 1.')
                .setColor("#2F3136"),
            new MessageEmbed()
                .setTitle('Page 2')
                .setDescription('This is page 2.')
                .setColor("#2F3136"),
            new MessageEmbed()
                .setTitle('Page 3')
                .setDescription('This is page 3.')
                .setColor("#2F3136"),
            new MessageEmbed()
                .setTitle('Page 4')
                .setDescription('This is page 4.')
                .setColor("#2F3136")
        ];
        // Create a new DiscordPaginator instance with the specified options
        const paginator = new DiscordPaginator([], {
            customId: 'paginator',
            customStyle: 'PRIMARY',
            customEmojis: {
                previous: '◀️',
                next: '▶️'
            },
            customEmbeds: embeds,
            timeout: 120000
        });
        // Create the message and paginate it
        paginator.createMessage(message.channel);
    }
})

client.login("token here") // Log in to the Discord API with the bot token
```