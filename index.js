require('dotenv').config();
const express = require('express');
const Chat = require('./database');
const { default: makeWASocket, DisconnectReason } = require('@adiwajshing/baileys');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (_, res) => res.send('Atha-Bot is running ✅'));
app.listen(port, () => console.log(`HTTP server listening on port ${port}`));

async function startBot() {
  const sock = makeWASocket({
    printQRInTerminal: true,
    auth: {
      creds: JSON.parse(process.env.SESSION_ID || '{}')
    }
  });

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if(connection === 'close') {
      if((lastDisconnect.error?.output?.statusCode ?? 0) !== DisconnectReason.loggedOut) {
        console.log('Reconnecting...');
        startBot();
      } else {
        console.log('Logged out from WhatsApp');
      }
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    const from = msg.key.remoteJid;
    const message = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

    try {
      const chat = new Chat({ from, message, timestamp: new Date() });
      await chat.save();
      console.log('Chat saved to DB:', message);
    } catch(e) {
      console.error('Error saving chat:', e);
    }

    // ... Tambah logic bot lainnya ...
  });
}

startBot();
