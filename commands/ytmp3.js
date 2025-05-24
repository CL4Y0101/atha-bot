const axios = require('axios');

module.exports = {
    name: 'ytmp3',
    execute: async (sock, msg) => {
        const text = msg.message.conversation || '';
        const args = text.split(' ');
        if (args.length < 2) return await sock.sendMessage(msg.key.remoteJid, { text: 'Kirim perintah dengan link YouTube! Contoh: ytmp3 https://youtube.com/watch?v=xxx' });

        const url = args[1];
        try {
            // Contoh API download YouTube audio, bisa ganti sesuai API favorit
            const res = await axios.get(`https://api.lyrics.ovh/v1/ytmp3?url=${encodeURIComponent(url)}`);
            if (!res.data || !res.data.audio) {
                return await sock.sendMessage(msg.key.remoteJid, { text: 'Gagal mendapatkan audio.' });
            }

            await sock.sendMessage(msg.key.remoteJid, {
                audio: { url: res.data.audio },
                mimetype: 'audio/mpeg'
            });
        } catch (err) {
            console.error(err);
            await sock.sendMessage(msg.key.remoteJid, { text: 'Error saat download audio YouTube.' });
        }
    }
};
