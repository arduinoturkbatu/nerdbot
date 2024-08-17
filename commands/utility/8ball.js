const { SlashCommandBuilder } = require('discord.js');

const responses = [
    'Yes', 'No', 'Maybe', 'Definitely', 'Absolutely not',
    'I wouldn’t count on it', 'It is certain', 'Don’t bet on it'
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Ask the Magic 8-Ball a question.')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('Your question')
                .setRequired(true)),

    async execute(interaction) {
        const question = interaction.options.getString('question');
        const response = responses[Math.floor(Math.random() * responses.length)];
        await interaction.reply({ content: `🎱 **Question:** ${question}\n**Answer:** ${response}` });
    },
};
