const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('joke')
        .setDescription('Get a random joke.'),

    async execute(interaction) {
        try {
            const response = await axios.get('https://v2.jokeapi.dev/joke/Any');
            const joke = response.data.type === 'single' ? response.data.joke : `${response.data.setup}\n${response.data.delivery}`;
            await interaction.reply({ content: joke });
        } catch (error) {
            await interaction.reply({ content: 'Failed to fetch a joke. Please try again later.' });
        }
    },
};