const {
    ModalBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    TextInputStyle,
    StringSelectMenuOptionBuilder
} = require('discord.js');
const {getLootItemsForChannel} = require('../dao');
module.exports = async (interaction) => {
    const modal = new ModalBuilder()
        .setCustomId(`loot_item_option_modal_${interaction.user.id}`)
        .setTitle('Add Loot Item Options');
    // Create inputs for the modal
    const lootItems = await getLootItemsForChannel(interaction.guild.name, true);
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('loot_item_select')
        .setPlaceholder('Select a Loot Item ID')
        .addOptions(
            lootItems.map(li =>
                new StringSelectMenuOptionBuilder()
                    .setLabel(li.id + " - " + li.name)
                    .setValue(li.id)
            )
        );

    // Create an action row for the select menu
    const selectMenuRow = new ActionRowBuilder().addComponents(selectMenu);
    const initialOptionsInput = new TextInputBuilder()
        .setCustomId('trait')
        .setLabel('Traits (comma seperated)')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);
    // Create rows for the inputs
    const inputRow = new ActionRowBuilder().addComponents(selectMenuRow);
    const optionsRow = new ActionRowBuilder().addComponents(initialOptionsInput);
    // Add the input rows to the modal
    modal.addComponents(inputRow, optionsRow);
    return modal;
}