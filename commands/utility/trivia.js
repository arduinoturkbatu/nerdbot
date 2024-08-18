const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trivia')
        .setDescription('Start a trivia game'),
    async execute(interaction) {
        const fetch = (await import('node-fetch')).default; // Dynamic import of node-fetch
        const url = 'https://opentdb.com/api.php?amount=1&type=multiple';

        try {
            const response = await fetch(url);
            const data = await response.json();
            const question = data.results[0];

            const options = [...question.incorrect_answers, question.correct_answer];
            options.sort(() => Math.random() - 0.5);

            let optionsText = '';
            options.forEach((option, index) => {
                optionsText += `${index + 1}. ${option}\n`;
            });

            const filter = response => {
                return options.some(option => option.toLowerCase() === response.content.toLowerCase());
            };

            await interaction.reply(`**${question.question}**\n\n${optionsText}`);

            const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] });

            const userAnswer = collected.first().content.toLowerCase();
            const correctAnswer = question.correct_answer.toLowerCase();

            if (userAnswer === correctAnswer) {
                await interaction.followUp(`🎉 Correct! The answer is **${question.correct_answer}**.`);
            } else {
                await interaction.followUp(`❌ Incorrect. The correct answer was **${question.correct_answer}**.`);
            }
        } catch (error) {
            console.error('Error fetching trivia question:', error);
            await interaction.reply('There was an error starting the trivia game. Please try again later.');
        }
    },
};
