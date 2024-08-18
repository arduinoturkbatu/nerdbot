const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token } = require('./config.json');
const { db, ref, get, set } = require('./firebase'); // Ensure the correct path to your firebase module
const { handleRPSInteraction } = require('./commands/utility/rps');
const nerdcoinEmoji = "<:nerdcoin:1274630170795315330>";

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();
client.cooldowns = new Collection();
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
    if (interaction.isChatInputCommand()) {
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
    } else if (interaction.isButton()) {
        const { customId } = interaction;
        const userId = interaction.user.id;

        if (customId === 'info') {
            const newEmbed = new EmbedBuilder()
                .setColor(0x150E1A)
                .setTitle('ℹ️ Utilities')
                .addFields(
                    { name: "`/help`", value: "Shows all available commands." },
                    { name: "`/ping`", value: "Replies with pong." },
                    { name: "`/server`", value: "Displays information about the server." },
                    { name: "`/user {target}`", value: "Displays information about an user. target is optional." },
                    { name: "`/qrcode *{text}`", value: "Generate a QR code from text. text is required."}
                )
                .setTimestamp();

            await interaction.reply({ content: '', ephemeral: true, embeds: [newEmbed] });
        } else if (customId === 'fun') {
            const newEmbed = new EmbedBuilder()
                .setColor(0x150E1A)
                .setTitle('🎡 Fun')
                .addFields(
                    { name: "`8ball *{question}`", value: "Ask the Magic 8-Ball a question." },
                    { name: "`funfact`", value: "Get a random fun fact." },
                    { name: "`joke`", value: "Get a random joke." },
                    { name: "`meme`", value: "Get a random meme." },
                    { name: "`petpic *{type}`", value: "Get a random pet picture. type can be Dog or Cat." },
                    { name: "`quote`", value: "Get a random inspirational quote." }
                )
                .setTimestamp();

            await interaction.reply({ content: '', ephemeral: true, embeds: [newEmbed] });
        } else if (customId === 'coins') {
            const newEmbed = new EmbedBuilder()
                .setColor(0x150E1A)
                .setTitle(`${nerdcoinEmoji} NerdCoins`)
                .addFields(
                    { name: "`balance {target}`", value: "Get your or a user's NerdCoin balance. target is optional." },
                    { name: "`coinflip *{side} *{amount}`", value: "Flip a coin and bet an amount. side and amount are required." },
                    { name: "`give *{target} *{amount}`", value: "Send some coins. target and amount are required." },
                    { name: "`gamble`", value: "Gamble your NerdCoins! Win or lose between -500 and 1000 coins." },
                    { name: "`leaderboard`", value: "Displays the top 10 users with the most NerdCoins." },
                    { name: "`register`", value: "Start using NerdCoins." }
                )
                .setTimestamp();

            await interaction.reply({ content: '', ephemeral: true, embeds: [newEmbed] });
        } else if (customId.startsWith("yes")) {
            try {
                await interaction.deferUpdate();

                // Retrieve user and target user data
                console.log(customId);
                const targetUserId = customId.split("_")[1];
                const giveAmount = customId.split("_")[3];
                const userRef = ref(db, `users/${customId.split("_")[4]}`);
                const targetUserRef = ref(db, `users/${targetUserId}`);
                const [userSnapshot, targetUserSnapshot] = await Promise.all([get(userRef), get(targetUserRef)]);
                const userData = userSnapshot.val();
                const targetUserData = targetUserSnapshot.val();

                // Check if users exist and have enough coins
                if (!userData || !targetUserData) {
                    throw new Error('User data not found');
                }
                if (userData.balance < giveAmount) {
                    throw new Error('Insufficient funds');
                }

                // Update user balances
                userData.balance = (parseInt(userData.balance) - parseInt(giveAmount));
                targetUserData.balance = (parseInt(targetUserData.balance) + parseInt(giveAmount));
                await Promise.all([set(userRef, userData), set(targetUserRef, targetUserData)]);

                // Send success message
                await interaction.editReply({ content: `You have successfully given **${giveAmount} ${nerdcoinEmoji}** to <@${targetUserId}>.`, components: [] });
            } catch (error) {
                console.error('Error handling button interaction:', error);
                await interaction.editReply({ content: `An error occurred: ${error.message}`, ephemeral: true });
            }
        } else if (customId === 'no') {
            // Handle the "No" button click
            await interaction.update({ content: '```Coin transfer canceled.```', components: [] });
        } else if (['rock', 'paper', 'scissors'].includes(interaction.customId)) {
            await handleRPSInteraction(interaction);
        } else if (customId === 'games') {
            const newEmbed = new EmbedBuilder()
                .setColor(0x150E1A)
                .setTitle(`🕹️ Games`)
                .addFields(
                    { name: "`rps`", value: "Play Rock-Paper-Scissors!" },
                    { name: "`trivia`", value: "Start a trivia game" }
                )
                .setTimestamp();

            await interaction.reply({ content: '', ephemeral: true, embeds: [newEmbed] });
        }
    }
});

client.login(token);
