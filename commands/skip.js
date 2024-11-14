const { SlashCommandBuilder } = require('discord.js');
const { skipTrack } = require('../utils/musicUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song'),

    async execute(interaction) {
        // Check if the user is in a voice channel when using the slash command
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return await interaction.reply({ content: 'You need to join a voice channel first!', ephemeral: true });
        }

        // Stop the track and disconnect
        await skipTrack(interaction);
    },

    async executeMessage(message) {
        // Check if the user is in a voice channel when using a message command
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.channel.send('You need to join a voice channel first!');
        }

        // Stop the track and disconnect
        await skipTrack(message);
    }
};
