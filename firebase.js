const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, get } = require('firebase/database');

const firebaseConfig = {
    apiKey: "AIzaSyBcyjp9pTcatZoAxgG_bP39lXYEJmYrhIU",
    authDomain: "nerdbot-9767.firebaseapp.com",
    databaseURL: "https://nerdbot-9767-default-rtdb.firebaseio.com",
    projectId: "nerdbot-9767",
    storageBucket: "nerdbot-9767.appspot.com",
    messagingSenderId: "569401327034",
    appId: "1:569401327034:web:2df9c4344d9d8724c5b183"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

module.exports = { db, ref, set, get };
