const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('petpic')
        .setDescription('Get a random pet picture.')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Type of pet')
                .setRequired(true)
                .addChoices(
                    { name: 'Dog', value: 'dog' },
                    { name: 'Cat', value: 'cat' }
                )),

    async execute(interaction) {
        const type = interaction.options.getString('type');
        let url = '';

        if (type === 'dog') {
            try {
                const response = await axios.get('https://dog.ceo/api/breeds/image/random');
                url = response.data.message;
            } catch (error) {
                await interaction.reply({ content: 'Failed to fetch a dog picture. Please try again later.' });
                return;
            }
        } else if (type === 'cat') {
            try {
                const response = await axios.get('https://api.thecatapi.com/v1/images/search');
                url = response.data[0].url;
            } catch (error) {
                await interaction.reply({ content: 'Failed to fetch a cat picture. Please try again later.' });
                return;
            }
        }

        await interaction.reply({ content: url });
    },
};
