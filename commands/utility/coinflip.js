const { SlashCommandBuilder } = require('discord.js');
const { db, ref, get, set } = require('../../firebase');
const nerdcoinEmoji = "<:nerdcoin:1274630170795315330>";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flip a coin and bet an amount.')
        .addStringOption(option =>
            option.setName('side')
                .setDescription('Choose either "head" or "tail".')
                .setRequired(true)
                .addChoices(
                    { name: 'Head', value: 'head' },
                    { name: 'Tail', value: 'tail' }
                ))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount of coins to bet.')
                .setRequired(true)
                .setMinValue(1)),

    async execute(interaction) {
        const userId = interaction.user.id;
        const userBet = interaction.options.getInteger('amount');
        const userSide = interaction.options.getString('side').toLowerCase();

        try {
            // Defer the reply to allow time for processing and animation
            await interaction.deferReply();

            const userRef = ref(db, `users/${userId}`);
            const snapshot = await get(userRef);
            const userData = snapshot.val();

            if (!userData) {
                return interaction.editReply({ content: 'You are not registered yet. Use the `/register` command to start using NerdCoins!', ephemeral: true });
            }

            if (userData.balance < userBet) {
                return interaction.editReply({ content: 'You do not have enough coins to place this bet.', ephemeral: true });
            }

            // Animation states
            const animationFrames = [
                'Flipping... |',
                'Flipping... /',
                'Flipping... -',
                'Flipping... \\'
            ];

            let resultMessage = '';

            // Simulate coin flipping animation
            for (let i = 0; i < 6; i++) {
                resultMessage = animationFrames[i % animationFrames.length];
                await interaction.editReply(resultMessage);
                await new Promise(resolve => setTimeout(resolve, 150)); // Wait 150ms between frames
            }

            // Final coin flip result
            const coinResult = Math.random() < 0.5 ? 'head' : 'tail';

            resultMessage = `The coin landed on **${coinResult}**! `;

            if (coinResult === userSide) {
                userData.balance += userBet;
                resultMessage += `You won **${userBet} ${nerdcoinEmoji}**! Your new balance is **${userData.balance} ${nerdcoinEmoji}**.`;
            } else {
                userData.balance -= userBet;
                resultMessage += `You lost **${userBet} ${nerdcoinEmoji}**. Your new balance is **${userData.balance} ${nerdcoinEmoji}**.`;
            }

            await set(userRef, userData);

            return interaction.editReply({ content: resultMessage });
        } catch (error) {
            console.error('Error executing the coinflip command:', error);
            return interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
};
