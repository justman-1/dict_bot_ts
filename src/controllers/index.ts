import BotClass from '../services/bot-service'
import { Message } from 'node-telegram-bot-api'
import bot from '../configs/bot'
const Bot = new BotClass(bot)

class Controllers {
  start(msg: Message) {
    Bot.start(msg)
  }

  help(msg: Message) {
    Bot.help(msg)
  }

  dict(msg: Message) {
    Bot.showDictionary(msg, 'default')
  }

  eng(msg: Message) {
    Bot.showDictionary(msg, 'eng')
  }

  rus(msg: Message) {
    Bot.showDictionary(msg, 'rus')
  }

  dictFull(msg: Message) {
    Bot.showFullDictionary(msg, 'default')
  }

  engFull(msg: Message) {
    Bot.showFullDictionary(msg, 'eng')
  }

  rusFull(msg: Message) {
    Bot.showFullDictionary(msg, 'rus')
  }

  add(msg: Message) {
    Bot.add(msg)
  }

  change(msg: Message) {
    Bot.change(msg)
  }

  del(msg: Message) {
    Bot.del(msg)
  }

  default(msg: Message) {
    Bot.default(msg)
  }

  test(msg: Message) {
    Bot.test(msg)
  }

  stoptest(msg: Message) {
    Bot.stop_test(msg)
  }

  error(err: any) {
    Bot.errorHandle(err)
  }
}

export default new Controllers()
