const { Client, GatewayIntentBits, GatewayDispatchEvents  } = require('discord.js');
const { connect } = require('@discordjs/voice'); // Import @discordjs/voice for voice channel connection
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const LavalinkManager = require('./utils/lavalinkManager');
const { testUsers } = require('./utils/constants');
const deployCommands = require('./deployScript');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.manager = LavalinkManager.initManager(client);

// Event: When the bot is ready to start working
client.on("ready", () => {
    console.log(`${client.user.tag} is ready!`);
});


client.commands = new Map();
const commands = [];

// Load commands dynamically from the 'commands' folder
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
    // Register each command with the Discord API for slash command deployment
    commands.push(command.data.toJSON()); // Assumes commands are built with SlashCommandBuilder
}

client.once('ready', async () => {
    console.log(`${client.user.tag} is online!`);
    client.manager.init(client);
    await deployCommands(); // Deploy commands when the bot starts
});

client.on('interactionCreate', async (interaction) => {
    // Only proceed if the interaction is a command
    if (!interaction.isCommand()) return;
    if (process.env.TEST_MODE) {
        if (!testUsers.includes(interaction.user.id)) {
            return await interaction.reply({content: 'This bot is currently in test mode.', ephemeral: true});
        }
    }
    // Extract command name
    const commandName = interaction.commandName;
    // Get the corresponding command from the client's collection
    const command = client.commands.get(commandName);
    // If no command was found, exit early
    if (!command) return;

    try {
        // Execute the command (if it has an execute method)
        if (command.execute) {
            await command.execute(interaction);
        }
    } catch (error) {
        console.error(error);
        await interaction.reply('There was an error executing that command.');
    }
});

client.on('trackEnd', async (player, track) => {
    if (player.queue.size === 0) {
        // No more tracks in the queue, stop the player
        player.stop();
    } else {
        // Automatically play the next track in the queue
        const nextTrack = player.queue[0];  // Get the next track in the queue
        player.play(nextTrack.uri);  // Play the next track
    }
});

client.login(process.env.DISCORD_TOKEN);
