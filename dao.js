// prisma.js (or wherever you handle Prisma interactions)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Function to add a new option with lootItemId
async function addOption(id, trait, lootItemId) {
    return await prisma.option.create({
        data: {
            id: id,
            trait: trait,
            lootItem: {
                connect: {
                    id: lootItemId
                }
            }
        }
    });
}

// Function to fetch options by lootItemId
async function getOptionsByLootItemId(lootItemId) {
    return await prisma.option.findMany({
        where: {
            lootItemId: lootItemId
        }
    });
}

// Function to add a loot item log
async function addLootItem(lootItemId, name, guild, user, threadId) {
    return await prisma.lootItem.create({
        data: {
            id: lootItemId,
            name: name,
            guild: guild,
            user: user,
            threadId: threadId
        }
    });
}

// Function to add a user selection
async function addUserSelection(username, lootItemId, optionId) {
    return await prisma.userSelection.create({
        data: {
            username: username,
            option: {
                    connect: {
                        id: optionId
                    }
            },
            lootItem: {
                connect: {
                    id: lootItemId
                }
            }
        }
    });
}

// Function to get users by option value
async function getUsersByOptionValue(optionValue) {
    const users = await prisma.userSelection.findMany({
        where: {
            optionValue: optionValue
        },
        select: {
            username: true
        }
    });
    return users.map(row => row.username);
}

// Function to get loot item details
async function getLootItemDetails(lootItemId) {
    const lootItem = await prisma.lootItem.findUnique({
        where: {
            id: lootItemId
        },
        include: {
            options: {
                include: {
                    selections: true
                }
            }
        }
    });
    return lootItem;
}
async function getLootItemsForChannel(guild, active) {
    return await prisma.lootItem.findMany({
        where: {
            guild: guild,
            active: active
        }
    });
}

async function addMessageIdToLootItem(lootItemId, messageId) {
    return await prisma.lootItem.update({
        where: {
            id: lootItemId
        },
        data: {
            messageId: messageId
        }
    });
}

async function getSelectionsByUsernameAndLootId(username, lootItemId) {
    return await prisma.userSelection.findMany({
        where: {
            username: username,
            lootItemId: lootItemId
        }
    });
}

async function addDescriptionToSelection(selectionId, description) {
    return await prisma.userSelection.update({
        where: {
            id: selectionId
        },
        data: {
            description: description
        }
    });
}
async function addUserSelectionReason(username, lootItemId, reason) {
    return await prisma.userSelection.update({
        where: {
            username: username,
            lootItemId: lootItemId
        },
        data: {
            reason: reason
        }
    });
}
module.exports = {
    addOption,
    getOptionsByLootItemId,
    addLootItem,
    addUserSelection,
    getUsersByOptionValue,
    getLootItemDetails,
    getLootItemsForChannel,
    addMessageIdToLootItem,
    getSelectionsByUsernameAndLootId,
    addDescriptionToSelection,
    addUserSelectionReason
};