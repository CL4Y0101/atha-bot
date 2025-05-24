module.exports = {
    name: 'menu',
    execute: async (sock, msg) => {
        await sock.sendMessage(msg.key.remoteJid, {
            text: '📜 *Atha-Bot Menu*\n\n1. ping\n2. menu\n\nKetik sesuai perintah!'
        })
    }
}