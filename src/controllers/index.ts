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

  dictMore(msg: Message, wordsIndex: string) {
    Bot.showFullDictionary(msg, 'default', parseInt(wordsIndex))
  }

  engMore(msg: Message, wordsIndex: string) {
    Bot.showFullDictionary(msg, 'eng', parseInt(wordsIndex))
  }

  rusMore(msg: Message, wordsIndex: string) {
    Bot.showFullDictionary(msg, 'rus', parseInt(wordsIndex))
  }

  add(msg: Message) {
    Bot.add(msg)
  }

  cancelWordAdd(msg: Message) {
    Bot.cancelWordAdd(msg)
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

  test_rus(msg: Message) {
    Bot.test_rus(msg)
  }

  stoptest(msg: Message) {
    Bot.stop_test(msg)
  }

  add_example(msg: Message) {
    Bot.add_example(msg)
  }

  definitions(msg: Message) {
    Bot.definitions(msg)
  }

  add_def(msg: Message) {
    Bot.add_def(msg)
  }

  del_def(msg: Message) {
    Bot.del_def(msg)
  }

  error(err: any) {
    Bot.errorHandle(err)
  }
}

export default new Controllers()
