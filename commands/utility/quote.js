const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote')
        .setDescription('Get a random inspirational quote.'),

    async execute(interaction) {
        try {
            const response = await axios.get('https://api.quotable.io/random');
            const quote = `"${response.data.content}" — ${response.data.author}`;
            await interaction.reply({ content: quote });
        } catch (error) {
            await interaction.reply({ content: 'Failed to fetch a quote. Please try again later.' });
        }
    },
};
