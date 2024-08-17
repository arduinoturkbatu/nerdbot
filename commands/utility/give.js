const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { db, ref, get, set } = require('../../firebase');

const exampleEmbed = (username, avatarUrl, botAvatarUrl, userToGive, giveAmount) => new EmbedBuilder()
    .setColor(0x8BCF00)
    .setTitle('🪙 NerdCoins Give')
    .setAuthor({ name: 'nerdbot', iconURL: botAvatarUrl })
    .setDescription(`Are you sure you want to give **${giveAmount} 🪙** to *${userToGive}*?`)
    .setThumbnail("https://em-content.zobj.net/source/telegram/386/coin_1fa99.webp")
    .setTimestamp()
    .setFooter({ text: `Requested by ${username}`, iconURL: avatarUrl });

const getUserData = async (userId, username, avatarURL, botAvatarURL, giveAmount, interid) => {
    const userRef = ref(db, `users/${userId}`);

    try {
        const snapshot = await get(userRef);
        const existingData = snapshot.val();
        console.log(snapshot.key);

        if (existingData) {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`yes_${snapshot.key}_${existingData.balance}_${giveAmount}_${interid}`)
                        .setLabel('Yes')
                        .setStyle(ButtonStyle.Success)
                        .setEmoji('✅'),
                    new ButtonBuilder()
                        .setCustomId('no')
                        .setLabel('No')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('❌'),
                );
            return { embeds: [exampleEmbed(username, avatarURL, botAvatarURL, existingData.username, giveAmount)], components: [row] };
        } else {
            return { content: 'User hasn\'t registered yet. Use the `/register` command to start using NerdCoins!', ephemeral: true };
        }
    } catch (error) {
        console.error('Error retrieving user data:', error);
        return { content: 'An error occurred. Please try again later.', ephemeral: true };
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('give')
        .setDescription('Send someone coins.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to give coins')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount of coins to give')
                .setRequired(true)),

    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const giveAmount = interaction.options.getInteger('amount').toString();
        const userId = targetUser.id;
        const username = interaction.user.username;
        const interid = interaction.user.id;
        const avatarURL = interaction.user.displayAvatarURL({ dynamic: true, size: 1024 });
        const botAvatarURL = interaction.client.user.displayAvatarURL({ dynamic: true, size: 1024 });

        try {
            const response = await getUserData(userId, username, avatarURL, botAvatarURL, giveAmount, interid);
            await interaction.reply(response);
        } catch (error) {
            console.error('Error executing the command:', error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};