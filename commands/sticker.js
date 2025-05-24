const { writeFileSync } = require('fs');
const { exec } = require('child_process');
const axios = require('axios');
const path = require('path');

module.exports = {
    name: 'sticker',
    execute: async (sock, msg) => {
        try {
            // Pastikan ada media gambar
            if (!msg.message.imageMessage && !msg.message.documentMessage) {
                return await sock.sendMessage(msg.key.remoteJid, { text: 'Kirim gambar dengan caption "sticker" untuk membuat stiker!' });
            }

            // Download media
            const stream = await sock.downloadMediaMessage(msg);
            const filename = path.join(__dirname, '..', 'session', `${msg.key.id}.webp`);
            writeFileSync(filename, stream);

            // Kirim balik stiker
            await sock.sendMessage(msg.key.remoteJid, { sticker: stream });
        } catch (err) {
            console.error(err);
            await sock.sendMessage(msg.key.remoteJid, { text: 'Gagal membuat stiker.' });
        }
    }
};
