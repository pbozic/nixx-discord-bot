const { SlashCommandBuilder } = require('discord.js');
const { playTrack } = require('../utils/musicUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song from YouTube or Spotify.')
        .addStringOption(option => 
            option.setName('query')
                .setDescription('The name or URL of the song to play')
                .setRequired(true)
        ),
    async execute(interaction) {
        // For slash command interaction
        const query = interaction.options.getString('query');
        
        if (!query) {
            return await interaction.reply('Please provide a song name or a URL.');
        }
        
        // Play the track (either from YouTube or Spotify)
        await playTrack(interaction, query);
        //await interaction.reply(`Now playing: ${query}`);
    },
    
    async executeMessage(message, args) {
        // For message-based command
        const query = args.join(' ');
        if (!query) {
            return message.channel.send('Please provide a song name or a URL.');
        }

        // Play the track (either from YouTube or Spotify)
        await playTrack(message, query);
    }
};