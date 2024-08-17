const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { db, ref, get } = require('../../firebase');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays the top 10 users with the most NerdCoins.'),

    async execute(interaction) {
        const usersRef = ref(db, 'users');

        try {
            const snapshot = await get(usersRef);
            const usersData = snapshot.val();

            if (!usersData) {
                return interaction.reply({ content: 'No users found.', ephemeral: true });
            }

            // Convert the usersData object to an array
            const usersArray = Object.entries(usersData).map(([userId, data]) => ({
                userId,
                username: data.username,
                balance: data.balance || 0,
            }));

            // Sort the users by balance (highest to lowest)
            const sortedUsers = usersArray.sort((a, b) => b.balance - a.balance).slice(0, 10);

            // Create an embed for the leaderboard
            const leaderboardEmbed = new EmbedBuilder()
                .setColor(0x8BCF00)
                .setTitle('🏆 NerdCoins Leaderboard')
                .setDescription('Top 10 users with the most NerdCoins')
                .setTimestamp()
                .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 1024 }) });;

            sortedUsers.forEach((user, index) => {
                leaderboardEmbed.addFields({ name: `#${index + 1} - ${user.username}`, value: `${user.balance} 🪙` });
            });

            // Send the embed to the channel
            await interaction.reply({ embeds: [leaderboardEmbed] });

        } catch (error) {
            console.error('Error retrieving leaderboard data:', error);
            await interaction.reply({ content: 'An error occurred while retrieving the leaderboard.', ephemeral: true });
        }
    },
};
