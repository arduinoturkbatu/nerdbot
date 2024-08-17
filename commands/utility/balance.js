const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { db, ref, get } = require('../../firebase');

const exampleEmbed = (username, avatarUrl, serverIconUrl, botAvatarUrl, coinsCount) => new EmbedBuilder()
    .setColor(0x8BCF00)
    .setTitle('🪙 NerdCoins Balance')
    .setAuthor({ name: 'nerdbot', iconURL: botAvatarUrl })
    .setDescription(`**Balance of *${coinsCount.username}*:** ${coinsCount.balance} 🪙`)
    .setThumbnail(serverIconUrl)
    .setTimestamp()
    .setFooter({ text: `Requested by ${username}`, iconURL: avatarUrl });

const getUserData = async (userId, username, avatarURL, serverIconURL, botAvatarURL) => {
    const userRef = ref(db, `users/${userId}`);

    try {
        const snapshot = await get(userRef);
        const existingData = snapshot.val();

        if (existingData) {
            return { embeds: [exampleEmbed(username, avatarURL, serverIconURL, botAvatarURL, existingData)] };
        } else {
            return { content: 'User hasn\'t registered yet. Use the `/register` command to start using NerdCoins!', ephemeral: true };
        }
    } catch (error) {
        console.error('Error retrieving user data:', error);
        return { content: 'An error occurred while retrieving your data. Please try again later.', ephemeral: true };
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Get your or a user\'s NerdCoin balance.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to get information about')
                .setRequired(false)),

    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const userId = targetUser ? targetUser.id : interaction.user.id;
        const username = interaction.user.username;
        const avatarURL = interaction.user.displayAvatarURL({ dynamic: true, size: 1024 });
        const botAvatarURL = interaction.client.user.displayAvatarURL({ dynamic: true, size: 1024 });
        const reqUserURL = targetUser ? targetUser.displayAvatarURL({ dynamic: true, size: 1024 }) : interaction.user.displayAvatarURL({ dynamic: true, size: 1024 });

        try {
            const response = await getUserData(userId, username, avatarURL, reqUserURL, botAvatarURL);
            await interaction.reply(response);
        } catch (error) {
            console.error('Error executing the command:', error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};
