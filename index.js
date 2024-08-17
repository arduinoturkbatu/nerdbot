const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands/utility');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! The bot logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'info') {
        const newEmbed = new EmbedBuilder()
            .setColor(0x8BCF00)
            .setTitle('ℹ️ Info')
            .addFields(
                {
                    name: "`/help`",
                    value: "Shows all available commands."
                },
                {
                    name: "`/ping`",
                    value: "Replies with pong."
                },
                {
                    name: "`/server`",
                    value: "Displays information about the server."
                },
                {
                    name: "`/user {target}`",
                    value: "Displays information about a user. target is optional."
                },
            )
            .setTimestamp();

        await interaction.reply({ content: '', ephemeral: true, embeds: [newEmbed] });
    } else if (interaction.customId === 'fun') {
        const newEmbed = new EmbedBuilder()
            .setColor(0x8BCF00)
            .setTitle('🎡 Fun')
            .addFields(
                {
                    name: "`8ball *{question}`",
                    value: "Ask the Magic 8-Ball a question."
                },
                {
                    name: "`funfact`",
                    value: "Get a random fun fact."
                },
                {
                    name: "`joke`",
                    value: "Get a random joke."
                },
                {
                    name: "`meme`",
                    value: "Get a random meme."
                },
                {
                    name: "`petpic *{type}`",
                    value: "Get a random pet picture. type can be Dog or Cat."
                },
                {
                    name: "`quote`",
                    value: "Get a random inspirational quote."
                },
            )
            .setTimestamp();

        await interaction.reply({ content: '', ephemeral: true, embeds: [newEmbed] });
    } else if (interaction.customId === 'coins') {
        const newEmbed = new EmbedBuilder()
            .setColor(0x8BCF00)
            .setTitle('🪙 NerdCoins')
            .addFields(
                {
                    name: "Not available",
                    value: ":("
                },
            )
            .setTimestamp();

        await interaction.reply({ content: '', ephemeral: true, embeds: [newEmbed] });
    }
});

client.login(token);