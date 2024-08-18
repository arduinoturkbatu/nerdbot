const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('Play Rock-Paper-Scissors!'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x150E1A)
            .setTitle('Rock-Paper-Scissors')
            .setDescription('Click a button below to make your choice!');

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('rock')
                    .setLabel('🪨 Rock')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('paper')
                    .setLabel('📄 Paper')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('scissors')
                    .setLabel('✂️ Scissors')
                    .setStyle(ButtonStyle.Primary)
            );

        await interaction.reply({ embeds: [embed], components: [row] });
    },
};

const choices = ['rock', 'paper', 'scissors'];

module.exports.handleRPSInteraction = async (interaction) => {
    const userChoice = interaction.customId;
    const botChoice = choices[Math.floor(Math.random() * choices.length)];
    let result;

    if (userChoice === botChoice) {
        result = "It's a tie!";
    } else if (
        (userChoice === 'rock' && botChoice === 'scissors') ||
        (userChoice === 'paper' && botChoice === 'rock') ||
        (userChoice === 'scissors' && botChoice === 'paper')
    ) {
        result = "You win!";
    } else {
        result = "You lose!";
    }

    const embed = new EmbedBuilder()
        .setColor(0x150E1A)
        .setTitle('Rock-Paper-Scissors')
        .setDescription(`You chose **${capitalizeFirstLetter(userChoice)}**.\nThe bot chose **${capitalizeFirstLetter(botChoice)}**.\n\n**${result}**`)
        .setTimestamp();

    await interaction.update({ embeds: [embed], components: [] });
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
