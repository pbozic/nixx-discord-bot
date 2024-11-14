const {
    ModalBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    TextInputBuilder,
    TextInputStyle,
    StringSelectMenuOptionBuilder
} = require('discord.js');
const { getOptionsByLootItemId, getLootItemDetails } = require('../dao');

module.exports = async (interaction) => {
    const lootItemId = interaction.customId.split('_')[2]; // Extract loot item ID
    let item = await getLootItemDetails(lootItemId);
    
    console.log(item, lootItemId);
    
    // Open a modal for selecting options
    const modal = new ModalBuilder()
        .setCustomId(`user_selection_modal_${lootItemId}`)
        .setTitle('Request Item');

    // Create a paragraph input for additional details
    const additionalInput = new TextInputBuilder()
        .setCustomId('additional_details')
        .setLabel('Any additional details about your request?')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false);

    // Create another action row for the input
    const inputRow = new ActionRowBuilder().addComponents(additionalInput);

    // Add both action rows to the modal
    modal.addComponents(inputRow); // Add both rows to the modal
    console.log('Dropdown Structure:', dropdown.toJSON());
    // Log the modal structure for debugging
    console.log('Modal Structure:', modal.toJSON());

    // Show the modal to the user
    return modal;
}