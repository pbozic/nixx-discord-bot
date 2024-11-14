const {
    ModalBuilder,
    SlashCommandBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
} = require('discord.js');
const { addOption, getOptionsByLootItemId, getLootItemDetails, getLootItemsForChannel } = require('../dao');
const { v4: uuidv4 } = require('uuid');
const embedLootMessage = require('../embeds/loot_message');
const modalAddOption = require('../modals/add_option');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('add_option')
        .setDescription('Adds a new option to an existing loot item.'),
    async execute(interaction) {
            const modal = await modalAddOption(interaction)
            // Show the modal to the user
            await interaction.showModal(modal);
        
    },
    modalHandler: async (modalInteraction) => {
        if (!modalInteraction.customId.startsWith('loot_item_option_modal_')) return;
        const lootItemId = modalInteraction.fields.getTextInputValue('loot_item_select');
        const trait = modalInteraction.fields.getTextInputValue('trait');
        const guild = modalInteraction.guild.name; // TODO: get guild name from channel
        const lootItem = await getLootItemDetails(lootItemId);
        // Generate a unique value for the option
        const id = `option_${uuidv4()}`;
       
        // Add the option to the database
        try {
            await addOption(id, trait, guild, lootItemId);
        } catch (error) {
            console.error('Error adding option:', error);
            await interaction.reply({ content: 'Failed to add option.', ephemeral: true });
            return;
        }

        console.log("option added to the database");
        const {itemName, options } = await getLootItemDetails(lootItemId);
        // Fetch all current options for the loot item
        // Create a new select menu with the updated options
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId(`select_${lootItemId}`)
            .setPlaceholder('Choose an option...')
            .addOptions(options.map(opt => ({
                label: opt.label,
                description: opt.description,
                value: opt.value,
            })));

        const row = new ActionRowBuilder().addComponents(selectMenu);

        // Update the original message with the new select menu
        const originalMessageId = lootItem.messageId; // You need to know the ID of the original message
        const channel = interaction.channel;
        const embed = embedLootMessage(interaction, lootItemId);
        console.log("embed created");
        // Fetch the original message and edit it
        try {
            const originalMessage = await channel.messages.fetch(originalMessageId);
            await originalMessage.edit({
                embeds: [embed],
                components: [row],
            });
            console.log("original message edited");
            await interaction.reply({ content: 'Option added successfully and dropdown updated!', ephemeral: true });
        } catch (error) {
            console.error('Error fetching or editing the original message:', error);
            await interaction.reply({ content: 'Failed to update the dropdown.', ephemeral: true });
        }
    }
};