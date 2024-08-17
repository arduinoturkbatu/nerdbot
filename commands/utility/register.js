const { SlashCommandBuilder } = require('discord.js');
const { db, ref, set, get } = require('../../firebase');

const storeUserData = async (userId, userData) => {
    const userRef = ref(db, `users/${userId}`);

    try {
        const snapshot = await get(userRef);
        const existingData = snapshot.val();

        if (!existingData) {
            // User doesn't exist, store new data
            await set(userRef, userData);
            console.log('User data stored successfully.');
            return true; // Indicate successful storage
        } else {
            console.log('User already exists.');
            return false; // Indicate existing user
        }
    } catch (error) {
        console.error('Error storing user data:', error);
        // Handle the error
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Start using NerdCoins.'),

    async execute(interaction) {
        const userId = interaction.user.id;
        const userData = {
            username: interaction.user.username,
            balance: 50,
        };

        try {
            await storeUserData(userId, userData);
            await interaction.reply('```Your information has been registered! Check your balance with `/balance`.```');
        } catch (error) {
            await interaction.reply('```There was an error registering your information.```');
        }
    },
};
