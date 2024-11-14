const { SlashCommandBuilder } = require('discord.js');
const { pauseTrack } = require('../utils/musicUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the current track.'),
    async execute(interaction) {
        // Ensure user is in a voice channel for the slash command interaction
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return await interaction.reply('You need to join a voice channel first!', { ephemeral: true });
        }

        // Resume the track
        await pauseTrack(interaction);
    },
    
    async executeMessage(message) {
        // Ensure user is in a voice channel for message-based command
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.channel.send('You need to join a voice channel first!');
        }

        // Resume the track
        await pauseTrack(message);
    }
};
