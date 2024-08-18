const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Displays information about an user.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to get information about')
                .setRequired(false)),  // Making this option optional

    async execute(interaction) {
        // Get the user mentioned or the command issuer if no user is mentioned
        const user = interaction.options.getUser('target') || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);
        const reqBy = interaction.user.username;

        // Create an embed with user information
        const userEmbed = new EmbedBuilder()
            .setColor(0x150E1A)
            .setTitle(`${user.username}'s Information`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: 'Username', value: user.username, inline: true },
                { name: 'Discriminator', value: `#${user.discriminator}`, inline: true },
                { name: 'ID', value: user.id, inline: true },
                { name: 'Joined Server', value: member ? new Date(member.joinedTimestamp).toLocaleDateString() : 'N/A', inline: true },
                { name: 'Account Created', value: new Date(user.createdTimestamp).toLocaleDateString(), inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `Requested by ${reqBy}` });

        await interaction.reply({ embeds: [userEmbed] });
    },
};
