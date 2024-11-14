const { 
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
 } = require('discord.js');

module.exports = async (id) => {
    const modal = new ModalBuilder()
        .setCustomId(`loot_item_modal_${id}`)
        .setTitle('Add Loot Item');
    console.log("modal created");
    // Create inputs for the modal
    const itemNameInput = new TextInputBuilder()
        .setCustomId('item_name')
        .setLabel('Item Name')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);
    console.log("item name input created");
    const initialOptionsInput = new TextInputBuilder()
        .setCustomId('initial_options')
        .setLabel('Traits (comma seperated)')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);
    console.log("initial options input created");
    // Create rows for the inputs
    const inputRow = new ActionRowBuilder().addComponents(itemNameInput);
    console.log("input row created");
    const optionsRow = new ActionRowBuilder().addComponents(initialOptionsInput);
    console.log("options row created");
    // Add the input rows to the modal
    modal.addComponents(inputRow, optionsRow);
    return modal;
}