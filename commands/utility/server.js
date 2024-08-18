const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Displays information about the server.'),

    async execute(interaction) {
        const guild = interaction.guild;
        const reqBy = interaction.user.username;

        // Create an embed with server information
        const serverEmbed = new EmbedBuilder()
            .setColor(0x150E1A)
            .setTitle(`${guild.name}'s Information`)
            .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: 'Server Name', value: guild.name, inline: true },
                { name: 'Server ID', value: guild.id, inline: true },
                { name: 'Created On', value: new Date(guild.createdTimestamp).toLocaleDateString(), inline: true },
                { name: 'Member Count', value: `${guild.memberCount}`, inline: true },
                { name: 'Region', value: guild.preferredLocale, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `Requested by ${reqBy}` });

        await interaction.reply({ embeds: [serverEmbed] });
    },
};
