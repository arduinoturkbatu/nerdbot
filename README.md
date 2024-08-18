# nerdbot
Experimental bot for Discord.

![logo](/images/logo.png)
> Made possible with Discord.js and FirebaseJS

## Commands

### Info

- **/help** Shows all available commands.
- **/ping** Replies with pong.
- **/random \*{min} \*{max}** Generate a random number between min and max.
- **/server** Displays information about the server.
- **/user {target}** Displays information about a user. target is optional.

### Fun

- **/8ball \*{question}** Ask the Magic 8-Ball a question.
- **/funfact** Get a random fun fact.
- **/joke** Get a random joke.
- **/meme** Get a random meme.
- **/petpic \*{type}** Get a random pet picture.
- **/quote** Get a random inspirational quote.
- **/qrcode \*{text}** Generate a QR code from text.

### NerdCoins

- **/balance {target}** Get your or a user's NerdCoin balance.
- **/coinflip \*{side} \*{amount}** Flip a coin and bet an amount.
- **/give \*{target} \*{amount}** Send some coins.
- **/gamble** Gamble your NerdCoins! Win or lose between -50 and 100 coins.
- **/leaderboard** Displays the top 10 users with the most NerdCoins.
- **/register** Start using NerdCoins.

## Games
- **/rps** Play Rock-Paper-Scissors!
- **/trivia** Start a trivia game

## Before forking.
Make sure you have `config.json` file on the base directory. Your file should look like this:
```json
{
    "clientId": /*...*/,
    "guildId": /*...*/,
    "token": /*...*/
}
```

You need to setup Firebase Realtime Database. Make sure you have `firebase.js` file on the base directory. Your file should look like this:
```js
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, get } = require('firebase/database');

const firebaseConfig = {
    // get config file from Firebase Console
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

module.exports = { db, ref, set, get };

```