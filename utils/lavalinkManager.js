const { Blue, Events, Types, Library } = require('blue.ts');
require('dotenv').config();
const TrackPlayingEmbed = require('../embeds/track_playing');   
const { getTextChannelById } = require('./helpers');
const Nodes = [{
    "identifier": "Nixx",
    "password": "nixxbot123",
    "host": "node.serenetia.com",
    "port": 40010,
    "secure": false
  }]

//Blue Manager Options
const options = {
    spotify: {
      client_id: process.env.SPOTIFY_CLIENT_ID,  //spotify client ID
      client_secret: process.env.SPOTIFY_CLIENT_SECRET //spotify client Secret
    },
    autoplay: false,
    version: "v4",
    library: Library.DiscordJs,
};
  
function initManager(client) {
    let manager = new Blue(Nodes, options);
    let timeoutAfterDone;

    manager.on('nodeConnect', (node) => {
        console.log(`Node "${node.identifier}" connected.`);
    });
    
    // Emitted whenever a node encountered an error
    manager.on('nodeError', (node, error) => {
        console.log(`Node "${node.identifier}" encountered an error: ${error.message}.`);
    });
    manager.on("trackStart", async (player, track) => {
        console.log("start")
        clearTimeout(timeoutAfterDone);
        const embed = TrackPlayingEmbed(player, track);
        const channel = await getTextChannelById(client, player.guildId, player.textChannel);
        if (channel) {
            await channel.send({ embeds: [embed] });
        } else {
            console.log("Channel not found or is not accessible.");
        }
    });
    manager.on("queueEnd", async (player, track) => {
        console.log("end")
        timeoutAfterDone = setTimeout(() => {
            player.destroy();
        }, 5 * 60 * 1000);
    });
    manager.on('trackError', async (player, e, error) => {
        console.log("track error", error)  
    });

    return manager;
    
}

async function createPlayer(interaction) {

    let player = await interaction.client.manager.create({
        voiceChannel: interaction.member?.voice?.channel?.id || null,
        textChannel: interaction.channel?.id,
        guildId: interaction.guild.id,
        selfDeaf: true,
        selfMute: false,
        volume: 20
      });

    return player;
}

module.exports = {
    initManager,
    createPlayer
};