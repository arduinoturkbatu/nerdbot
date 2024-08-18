const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const QRCode = require('qrcode');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('qrcode')
        .setDescription('Generate a QR code from text')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('The text to convert into a QR code')
                .setRequired(true)),
    async execute(interaction) {
        const text = interaction.options.getString('text');

        try {
            // Generate QR code as a buffer
            const qrBuffer = await QRCode.toBuffer(text);

            // Create an attachment for the QR code image
            const attachment = new AttachmentBuilder(qrBuffer, { name: 'qrcode.png' });

            // Reply with the QR code image
            await interaction.reply({ files: [attachment] });
        } catch (error) {
            console.error('Error generating QR code:', error);
            await interaction.reply({ content: 'There was an error generating the QR code. Please try again later.', ephemeral: true });
        }
    },
};
