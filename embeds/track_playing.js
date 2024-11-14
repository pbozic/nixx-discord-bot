const { EmbedBuilder } = require('discord.js');
const path = require('path'); // To handle file paths
const rootDir = path.resolve(__dirname, '../');
const fs = require('fs'); // File system module
module.exports = (interaction, track) => {
    // Create the embed
    console.log("now playing track", track);

    let color = "#0000FF";  // Default color for Spotify
    let iconUrl = "https://w7.pngwing.com/pngs/19/819/png-transparent-apple-earbuds-emoji-headphones-music-emoji-smiley-desktop-wallpaper-music-note-thumbnail.png" // Spotify logo URL
    if (isYouTubeLink(track.uri)) {
        color = "#FF0000";    // YouTube red color
        iconUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Logo_of_YouTube_%282015-2017%29.svg/502px-Logo_of_YouTube_%282015-2017%29.svg.png" // YouTube logo URL
    } else if (isSpotifyLink(track.uri)) {
        color = "#1DB954";  // Default color for Spotify
        iconUrl ="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png" // Spotify logo URL
    }

    const title = track.title || 'Unknown Title';
    const author = track.author || 'Unknown Author';
    const artworkUrl = track.artworkUrl || 'https://i.imgur.com/placeholder.png'; // Use a placeholder if artwork is missing
    const duration = track.duration || 0;
    const uri = track.uri || '';
    const embed = new EmbedBuilder()
      .setColor(color) // Set color based on platform
      .setTitle('Now Playing') // Title text without icons
      .setURL(uri)
      .setThumbnail(artworkUrl)
      .setDescription(`**${title}** by **${author}**`)
      .addFields(
        { name: 'Title', value: title, inline: true },
        { name: 'Author', value: author, inline: true },
        { name: 'Duration', value: formatDuration(duration), inline: true }
      )
      .setFooter({
        text: 'Powered by NixxBot',
        iconURL: iconUrl, // Display the icon of the platform (YouTube or Spotify)
      });

    return embed;
}
const formatDuration = ms => {
    const seconds = Math.floor((ms / 1000) % 60).toString().padStart(2, '0');
    const minutes = Math.floor((ms / (1000 * 60)) % 60).toString().padStart(2, '0');
    return `(${minutes}:${seconds})`;
};

function isYouTubeLink(url) {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return youtubeRegex.test(url);
}

function isSpotifyLink(url) {
    const spotifyRegex = /^(https?:\/\/)?(open\.spotify\.com)\/.+$/;
    return spotifyRegex.test(url);
}