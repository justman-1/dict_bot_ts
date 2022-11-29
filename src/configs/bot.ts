import TelegramBot from "node-telegram-bot-api"

const { commandsObj } = require("./options")

const token: string = process.env.tg_bot_token || ""
const bot: TelegramBot = new TelegramBot(token, { polling: true })
bot.setMyCommands(commandsObj)

export default bot
