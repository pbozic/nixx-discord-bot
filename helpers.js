async function getChannelByName(client, guildId, channelName) {
    try {
      // Fetch the guild by its ID
      const guild = await client.guilds.fetch(guildId);
      
      // Find the channel by name within the guild
      const channel = guild.channels.cache.find(ch => ch.name === channelName);
      
      if (channel) {
        return channel;
      } else {
        console.log(`Channel "${channelName}" not found in guild "${guild.name}".`);
        return null;
      }
    } catch (error) {
      console.error("Error finding channel by name:", error);
      return null;
    }
}

async function createMessageAndThread(channelId, messageContent, threadName) {
    try {
      // Fetch the channel
      const channel = await client.channels.fetch(channelId);
  
      // Send a new message
      const message = await channel.send(messageContent);
  
      // Create a thread from the new message
      const thread = await message.startThread({
        name: threadName,
        autoArchiveDuration: 10080, // Archive after 24 hours of inactivity
        reason: 'Creating a thread from a newly sent message',
      });
  
      console.log(`Thread '${thread.name}' created from message: ${messageContent}`);
    } catch (error) {
      console.error("Error creating message and thread:", error);
    }
}

module.exports = {
    getChannelByName,
    createMessageAndThread,
};