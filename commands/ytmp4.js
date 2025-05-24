const axios = require('axios');

module.exports = {
    name: 'ytmp4',
    execute: async (sock, msg) => {
        const text = msg.message.conversation || '';
        const args = text.split(' ');
        if (args.length < 2) return await sock.sendMessage(msg.key.remoteJid, { text: 'Kirim perintah dengan link YouTube! Contoh: ytmp4 https://youtube.com/watch?v=xxx' });

        const url = args[1];
        try {
            // Contoh API download YouTube video, bisa ganti sesuai API favorit
            const res = await axios.get(`https://api.lyrics.ovh/v1/ytmp4?url=${encodeURIComponent(url)}`);
            if (!res.data || !res.data.video) {
                return await sock.sendMessage(msg.key.remoteJid, { text: 'Gagal mendapatkan video.' });
            }

            await sock.sendMessage(msg.key.remoteJid, {
                video: { url: res.data.video },
                mimetype: 'video/mp4'
            });
        } catch (err) {
            console.error(err);
            await sock.sendMessage(msg.key.remoteJid, { text: 'Error saat download video YouTube.' });
        }
    }
};
