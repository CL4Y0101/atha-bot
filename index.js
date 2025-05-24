require('dotenv').config()
const fs = require('fs')
const path = require('path')
const { default: makeWASocket, useSingleFileAuthState } = require('@whiskeysockets/baileys')

const { state, saveState } = useSingleFileAuthState('./session/auth_info.json')

async function startBot() {
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    })

    sock.ev.on('creds.update', saveState)

    // Load all commands
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
    const commands = new Map()
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`)
        commands.set(command.name, command)
    }

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message || msg.key.fromMe) return

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || ''
        const command = text.split(' ')[0].toLowerCase()

        if (commands.has(command)) {
            try {
                await commands.get(command).execute(sock, msg)
            } catch (err) {
                console.error('Error running command:', err)
            }
        }
    })
}

startBot()

const express = require('express')
const app = express()
const port = process.env.PORT || 3000
app.get('/', (_, res) => res.send('Atha-Bot is running ✅'))
app.listen(port, () => console.log(`HTTP server listening on ${port}`))
