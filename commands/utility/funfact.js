const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('funfact')
        .setDescription('Get a random fun fact.'),

    async execute(interaction) {
        try {
            const response = await axios.get('http://numbersapi.com/random/trivia');
            const fact = response.data;
            await interaction.reply({ content: fact });
        } catch (error) {
            await interaction.reply({ content: 'Failed to fetch a fun fact. Please try again later.' });
        }
    },
};
