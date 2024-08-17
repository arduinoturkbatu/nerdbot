const { SlashCommandBuilder } = require('discord.js');
const { db, ref, get, set } = require('../../firebase');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gamble')
        .setDescription('Gamble your NerdCoins! Win or lose between -50 and 100 coins.'),

    async execute(interaction) {
        const userId = interaction.user.id;
        const userRef = ref(db, `users/${userId}`);

        try {
            // Retrieve user data
            const snapshot = await get(userRef);
            const userData = snapshot.val();

            if (!userData) {
                return interaction.reply({ content: 'You are not registered yet. Use the `/register` command to start using NerdCoins!', ephemeral: true });
            }

            // Weighted random generation: more likely to get higher numbers
            const gambleResult = weightedRandom(-50, 100);

            if (isNaN(gambleResult)) {
                throw new Error('Invalid gamble result: NaN');
            }

            // Update the user's balance
            const newBalance = (userData.balance || 0) + gambleResult;

            // Save the new balance to Firebase
            await set(userRef, { ...userData, balance: newBalance });

            // Determine the outcome message
            let resultMessage;
            if (gambleResult > 0) {
                resultMessage = `🎉 You won **${gambleResult} 🪙**! Your new balance is **${newBalance} 🪙**.`;
            } else if (gambleResult < 0) {
                resultMessage = `😢 You lost **${Math.abs(gambleResult)} 🪙**. Your new balance is **${newBalance} 🪙**.`;
            } else {
                resultMessage = `😐 You broke even. Your balance remains at **${newBalance} 🪙**.`;
            }

            // Reply to the interaction with the result
            await interaction.reply({ content: resultMessage });

        } catch (error) {
            console.error('Error executing the gamble command:', error);
            await interaction.reply({ content: 'An error occurred while processing your gamble. Please try again later.', ephemeral: true });
        }
    },
};

// Weighted random function that biases towards higher numbers
function weightedRandom(min, max) {
    const randomValue = Math.random(); // Value between 0 and 1
    const weight = Math.pow(randomValue, 3); // Skews the random value towards higher numbers (0 to 1)
    const result = Math.round(weight * (max - min) + min); // Scales to the desired range

    return isNaN(result) ? min : result; // Fallback to min if result is NaN
}
