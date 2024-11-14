// musicUtils.js
const { PermissionsBitField, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
require('dotenv').config();
const {music_channels} = require('./constants');
const fs = require('fs');
const { Types } = require('blue.ts');
// Set up Spotify API

const {createPlayer} = require('./lavalinkManager');

// Function to play a track
async function playTrack(interaction, query) {
    const voiceChannel = interaction.member.voice.channel;
    const textChannel = interaction.channel;

    if (music_channels[interaction.guild.id] && music_channels[interaction.guild.id] !== textChannel.id) {
        return await interaction.reply({
            content: `Please use the music commands in <#${music_channels[interaction.guild.id]}>.`,
            ephemeral: true
        });
    }
    // Check if the user is in a voice channel
    if (!voiceChannel) {
        return await interaction.reply({
            content: "You need to join a voice channel first!",
            ephemeral: true // Visible only to the user
        });
    }

    // Ensure bot has permission to connect and speak
    if (!voiceChannel.permissionsFor(interaction.client.user).has(PermissionsBitField.Flags.Connect)) {
        return await interaction.reply({
            content: "I don't have permission to connect to the voice channel.",
            ephemeral: true
        });
    }

    if (!voiceChannel.permissionsFor(interaction.client.user).has(PermissionsBitField.Flags.Speak)) {
        return await interaction.reply({
            content: "I don't have permission to speak in the voice channel.",
            ephemeral: true
        });
    }

    let player = await interaction.client.manager.players.get(interaction.guild.id);

    if (!player) {
        player = await createPlayer(interaction);
    }

    player.volume = 10;

    // Search for the track and play it
    console.log(query)
    let res = null;
    const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/;
    const spotifyRegex = /^(https?\:\/\/)?(open\.spotify\.com)\/.+$/;
    try {
        if (youtubeRegex.test(query)) {
            // If YouTube link, search with 'youtube' source
            res = await interaction.client.manager.search({ query: query, source: "youtube" }, interaction.author);
        } else if (spotifyRegex.test(query)) {
            // If Spotify link, search with 'spotify' source
            res = await interaction.client.manager.search({ query: query, source: "spotify" }, interaction.author);
        } else {
            // Handle other queries (like search terms or other links)
            res = await interaction.client.manager.search({ query: query }, interaction.author);
        }
    } catch (error) {
        return await interaction.reply("error", error);
    }
   

    console.log(res)
    if (!res || res.tracks.length === 0) {
        return await interaction.reply("No songs found.");
    }

    // If it's a playlist, load all tracks
    if (res.loadType == Types.LOAD_SP_ALBUMS || res.loadType == Types.LOAD_PLAYLIST) {
        for (const track of res.tracks) {
            console.log(track)
            player.queue.add(track);
        }
       
        await interaction.reply(`Loaded **${res.tracks.length}** tracks from \`${res.name}\`.`);
        if (!player.queue.current) player.play();
    } else if (res.loadType === "search") {
        // If it's a search result, display the first 5 options and let the user select
        const options = res.tracks.slice(0, 5).map((track, index) => ({
            label: `${track.info.title}`,
            description: `by ${track.info.author}`,
            value: `${index}`
        }));

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('select-track')
            .setPlaceholder('Choose a track to play')
            .addOptions(options);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await interaction.reply({
            content: "Select a track from the search results:",
            components: [row],
            ephemeral: true
        });

        // Handle the selection
        const filter = i => i.customId === 'select-track' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            const selectedTrack = res.tracks[parseInt(i.values[0])];
            console.log(selectedTrack)
            player.queue.add(selectedTrack);
            await i.reply({ content: `Track: **${selectedTrack.info.title}** added to queue.`, components: [] });
            if (!player.queue.current) player.play();
        });

        collector.on('end', async collected => {
            if (!collected.size) {
                const firstTrack = res.tracks[0];
                player.queue.add(firstTrack);
                await interaction.reply({ content: `No track selected. Playing the first song: **${firstTrack.info.title}**.`, components: [] });
                if (!player.queue.current) player.play();
            }
        });
    } else {
        // If only one track is found, add it to the queue and play
        player.queue.add(res.tracks[0]);
        await interaction.reply(`Track: **${res.tracks[0].info.title}** added to queue.`);
        if (!player.queue.current) player.play();
    }
    
}

// Function to pause the track
async function pauseTrack(interaction) {
    const player = interaction.client.manager.players.get(interaction.guild.id);
    if (!player || !player.playing) {
        return interaction.channel.send('No track is playing.');
    }

    player.pause(true);
    await interaction.reply("Paused the current track.");
}

// Function to resume the paused track
async function resumeTrack(interaction) {
    const player = interaction.client.manager.players.get(interaction.guild.id);
    if (!player || !player.paused) {
        return interaction.channel.send('Track is already playing.');
    }

    player.pause(false);
    await interaction.reply("Resumed the current track.")
}

// Function to stop the track and disconnect from the channel
async function stopTrack(interaction) {
    const player = interaction.client.manager.players.get(interaction.guild.id);
    if (!player) {
        return interaction.channel.send('No track is playing.');
    }

    player.destroy(); // Destroy player and disconnect
    await interaction.reply("'Stopped the music and left the channel.")
}

async function skipTrack(interaction) {
    const player = interaction.client.manager.players.get(interaction.guild.id);
    if (!player) {
        return interaction.channel.send('No track is playing.');
    }

    player.stop();
    await interaction.reply("Skipped the current track.")
}
module.exports = { playTrack, pauseTrack, resumeTrack, stopTrack, skipTrack };