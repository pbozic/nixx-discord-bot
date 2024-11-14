const { EmbedBuilder } = require('discord.js');
const { getLootItemDetails } = require('../dao');
module.exports = async (interaction, lootItemId) => {
    const member = interaction.member;
    const lootItem = await getLootItemDetails(lootItemId);
    let footerText = `Loot Item ID: ${lootItemId}`;
    if (member.roles.cache.some(role => role.name === 'Admin')) {
        footerText += `\nuse /add_option to add options to this loot item`;
    }
    console.log(lootItem);
    // Create the embed
    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(lootItem.name)
        .setDescription("Test Description")

    //Add each option as a field in the embed
    lootItem.options.forEach(option => {
        let userList = option.selections.map((user, index) => `${index + 1}. ${user.username}`).join("\n");
        if (option.selections.length === 0) {
            userList = "\u200B"
        }
        embed.addFields({ name: `${option.trait} (${option.selections.length})`, value: userList, inline: true });
    })
    embed.setTimestamp()
        .setFooter({text: footerText});
    

   console.log(embed.toJSON());
   
    return embed;
}
