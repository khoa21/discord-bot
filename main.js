require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');

//const {DISCORD_TOKEN: tokenin} = process.env;

//const {REST} = require("@discordjs/rest");
//const {Routes} = require("discord-api-types/v9");
const {Collection, Client, Events, IntentsBitField} = require('discord.js');
//const {Player} = require("discord-player");

const {token} = require('./config.json')
const {ClientReady} = require("events");
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});



const commands = [];
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolder = fs.readdirSync(foldersPath);

for (const folder of commandFolder) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}


client.once(Events.ClientReady, ()=> {
    console.log(`What up bitches papi is here!`);
});

//client.player = new Player(client,
    //{
       // ytdlOptions:
          //  {
        //        quality: "highestaudio",
     //           highWaterMark: 1 << 25
    //        }
//    });

//client.on('ready', (c) => {
    //const guild_ids = client.guilds.cache.map(guild => guild.id);

  // const rest = new REST ({version: "9"}).setToken(process.env.DISCORD_TOKEN)
//});

client.on('messageCreate', (message)=> {
    if (message.content === 'yo')
    {
        message.reply('AAAAAAAAAAAAAAAAAAAAAAA');
    }
    else if(message.content ==='play')
    {
        message.reply('hehehe')
    }
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});
client.login(token);