const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const exampleEmbed = (username, avatarUrl, serverIconUrl, botAvatarUrl) => new EmbedBuilder()
    .setColor(0x8BCF00)
    .setTitle('Help')
    .setAuthor({ name: 'nerdbot', iconURL: botAvatarUrl })  // Use a URL here
    .setDescription('See all available commands.')
    .setThumbnail(serverIconUrl)
    .setTimestamp()
    .setFooter({ text: `Requested by ${username}`, iconURL: avatarUrl });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows all available commands.'),
    async execute(interaction) {
        const username = interaction.user.username;
        const avatarURL = interaction.user.displayAvatarURL({ dynamic: true, size: 1024 });
        const serverIconURL = interaction.guild.iconURL({ dynamic: true, size: 1024 });
        const botAvatarURL = interaction.client.user.displayAvatarURL({ dynamic: true, size: 1024 });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('info')
                    .setLabel('Info')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('ℹ️'),
                new ButtonBuilder()
                    .setCustomId('fun')
                    .setLabel('Fun')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🎡'),
                new ButtonBuilder()
                    .setCustomId('coins')
                    .setLabel('NerdCoins')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('🪙')
            );

        await interaction.reply({ embeds: [exampleEmbed(username, avatarURL, serverIconURL, botAvatarURL)], components: [row] });
    },
};
