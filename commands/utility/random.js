const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('random')
        .setDescription('Generate a random number between min and max.')
        .addIntegerOption(option =>
            option.setName('min')
                .setDescription('The minimum value')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('max')
                .setDescription('The maximum value')
                .setRequired(true)),
    async execute(interaction) {
        const min = interaction.options.getInteger('min');
        const max = interaction.options.getInteger('max');

        if (min >= max) {
            return interaction.reply({ content: 'The minimum value must be less than the maximum value.', ephemeral: true });
        }

        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

        await interaction.reply({ content: `Generated random number between **${min}** and **${max}** is **${randomNumber}**.` });
    }
};
