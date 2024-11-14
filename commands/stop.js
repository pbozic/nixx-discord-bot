const { SlashCommandBuilder } = require('discord.js');
const { stopTrack } = require('../utils/musicUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the music and disconnect from the voice channel.'),

    async execute(interaction) {
        // Check if the user is in a voice channel when using the slash command
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return await interaction.reply({ content: 'You need to join a voice channel first!', ephemeral: true });
        }

        // Stop the track and disconnect
        await stopTrack(interaction);
    },

    async executeMessage(message) {
        // Check if the user is in a voice channel when using a message command
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.channel.send('You need to join a voice channel first!');
        }

        // Stop the track and disconnect
        await stopTrack(message);
    }
};
