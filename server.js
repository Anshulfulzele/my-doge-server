const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const TelegramBot = require('node-telegram-bot-api');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Use Environment Variables from Render
const token = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;
const bot = new TelegramBot(token, { polling: true });

app.use(bodyParser.json());

// Basic route to check if server is alive
app.get('/', (req, res) => {
    res.send('Server is running properly.');
});

// Handle WebSocket connections from the APK
wss.on('connection', (ws) => {
    console.log('New device connected');
    ws.on('message', (message) => {
        // Forward data from phone to Telegram
        bot.sendMessage(chatId, `Incoming Data: ${message}`);
    });
});

// IMPORTANT: Bind to 0.0.0.0 and use Render's Port
const PORT = process.env.PORT || 10000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is listening on port ${PORT}`);
});
