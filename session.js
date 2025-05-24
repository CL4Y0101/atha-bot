const { useMultiFileAuthState, default: makeWASocket } = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState("session");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  });

  sock.ev.on("creds.update", saveCreds);
  sock.ev.on("connection.update", (update) => {
    const { connection } = update;
    if (connection === "open") {
      console.log("✅ Session berhasil dibuat!");
    }
  });
}

start();
