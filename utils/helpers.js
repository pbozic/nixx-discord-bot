async function getTextChannelById(client, guildId, channelId) {
    try {
      // Fetch the guild by its ID
      const guild = await client.guilds.fetch(guildId);
      if (!guild) return null;
  
      // Fetch the channel by its ID
      const channel = guild.channels.cache.get(channelId);
  
      // Ensure it's a text-based channel
      if (channel && channel.isTextBased()) {
        return channel;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching channel: ${error}`);
      return null;
    }
}

module.exports = {
    getTextChannelById
};