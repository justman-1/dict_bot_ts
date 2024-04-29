import TelegramBot from 'node-telegram-bot-api'

const { commandsObj } = require('./options')

const token: string = process.env.tg_bot_token || ''
const bot: TelegramBot = new TelegramBot(token, { polling: true })
bot.setMyCommands(commandsObj)
//929651012
//bot.sendMessage( 1112961159, ``)

export default bot
