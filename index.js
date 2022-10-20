const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

//Require necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config()

// Create a new instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles){
    const filePath = path.join(commandsPath,file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command){
        client.commands.set(command.data.name, command);
    }else {
        console.log(`[WARNING] the command at ${filePath} is missing a required "data" or "execute" property.`);
    }
};




client.once(Events.ClientReady, () => {
	console.log('Ready!');
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'beep') {
		await interaction.reply('Boop!');
	};

    if (commandName === 'user'){
        await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
    };
    if (commandName === 'server'){ 
        await interaction.reply(`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`)
    }
});


// Log into discord with client token
//console.log(process.env.DISCORD_TOKEN);
client.login(process.env.DISCORD_TOKEN);

