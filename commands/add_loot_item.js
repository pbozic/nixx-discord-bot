// commands/add_loot_item.js
const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');
const { v4: uuidv4 } = require('uuid');
const {
    addLootItem,
    addOption,
    addMessageIdToLootItem
} = require('../dao');
const embedLootMessage = require('../embeds/loot_message');
const modalLootItem = require('../modals/add_item');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('add_loot_item')
        .setDescription('Creates a loot item and initializes options.'),

    async execute(interaction) {
        try {
            const modal = await modalLootItem(interaction.user.id)
            await interaction.showModal(modal);
        } catch (error) {
            console.error('Error in /add_loot_item:', error);
            await interaction.reply({ content: 'There was an error processing your request.', ephemeral: true });
        }
    },

    modalHandler: async (modalInteraction) => {
        if (!modalInteraction.customId.startsWith('loot_item_modal_')) return;
        console.log("modal handler executed");
        const itemName = modalInteraction.fields.getTextInputValue('item_name');
        const initialOptions = modalInteraction.fields.getTextInputValue('initial_options').split(',').map(opt => opt.trim());
        const guild = modalInteraction.guild.name; // TODO: get guild name from channel
        const lootItemId = uuidv4();  // Generate a unique ID for the loot item
        let lootItem = null
        // Log the loot item execution
        const thread = await modalInteraction.channel.threads.create({
            name: `${itemName}`,
            autoArchiveDuration: 1440, // Auto-archive after 60 minutes of inactivity
            reason: `Thread for tracking selections for loot item ID ${lootItemId}`
        });
        try {
           lootItem = await addLootItem(lootItemId, itemName, guild, modalInteraction.user.username, thread.id);
        } catch (error) {
            console.error('Error adding loot item:', error);
            return modalInteraction.reply('Failed to add loot item to the database.');
        }
       
        // Add initial options to the database
        const savedOptions = [];  
        for (const option of initialOptions) {
            const trait = option
            option.id = `option_${uuidv4()}`; // Unique value for each option
            try {
                let opt = await addOption(option.id, trait, lootItemId);
                savedOptions.push(opt);
            } catch (error) {
                console.error('Error adding option:', error);
                return modalInteraction.reply('Failed to add option to the database.');
                
            }
           
        }

        const dropdown = new StringSelectMenuBuilder()
            .setCustomId('select_loot_item_' + lootItemId)
            .setPlaceholder('Select prefered trait...')
            .setMinValues(1) // Minimum selection
            .setMaxValues(1) // Maximum selection
            .addOptions(savedOptions.map(option => {
                return new StringSelectMenuOptionBuilder()
                    .setLabel(option.trait)
                    .setValue(option.id) // Unique value for each selection
                    .setDescription(`Select this option for ${itemName}`); // Correct item name property
            }));

        // Create an action row for the dropdown
        const dropdownRow = new ActionRowBuilder().addComponents(dropdown);
        
        let reasonOptions = [
            {
                id: `bis`,
                label: "Best in Slot"
            },
            {
                id: `trait`,
                label: "Trait"
            },
            {
                id: `litho`,
                label: "Litho"
            },
            {
                id: `other`,
                label: "Other"
            }
        ]
        const dropdownReason = new StringSelectMenuBuilder()
       
        .setCustomId('select_loot_item_reason_' + lootItemId)
        .setPlaceholder('Select Reason...')
        .setMinValues(1) // Minimum selection
        .setMaxValues(1) // Maximum selection
        .addOptions(reasonOptions.map(option => {
            return new StringSelectMenuOptionBuilder()
                .setLabel(option.label)
                .setValue(option.id) // Unique value for each selection
                .setDescription(`Select this option for ${itemName}`); // Correct item name property
        }));

    // Create an action row for the dropdown
        const dropdownRow2 = new ActionRowBuilder().addComponents(dropdownReason);
        const embed =  await embedLootMessage(modalInteraction, lootItemId);
        console.log("embed created");
        // Notify the user with the dropdown
       

        // Send the embed in the thread
        const sentMessage = await thread.send({ embeds: [embed], components: [dropdownRow, dropdownRow2] });
        try {
            await addMessageIdToLootItem(lootItemId, sentMessage.id);
        } catch (error) {
            console.error('Error adding message ID to loot item:', error);
            return modalInteraction.reply('Failed to add message ID to the database.');
        }
        
        await modalInteraction.reply({ content: "Loot item added!", ephemeral: true });
        // await modalInteraction.reply({
        //     content: `Item created sucessfully`
        // });
        //await modalInteraction.reply({ embeds: [embed], components: [dropdownRow] });

        // Add a listener for the select menu
        // Note: You should add this logic in your main bot file or a dedicated event handler
        // Example: handleSelectMenu(modalInteraction, lootItemId);
    }
};