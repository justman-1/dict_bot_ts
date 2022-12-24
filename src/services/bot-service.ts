import mongo from './mongo-service'
import TelegramBot, { Message } from 'node-telegram-bot-api'
const {
  buttons,
  start_text,
  help_text,
  del_text,
  is_word_text,
  success_save,
  buttonsAfterAdd,
  buttonsIsWord,
  success_delete,
  unsuccess_delete,
  buttonsWithoutDict,
  buttonsWithoutDictFunc,
  enterEngWord,
  enterTranslate,
  buttonsAfterTest,
  addExampleButton,
  example_added_text
} = require('../configs/options')
import Cache from './cache-service'
import Dictionary from './dictionary-service'
import Forming from './forming-service'
import { DictObj, TestOptions, WordObj } from '../types'
import Test from './test-service'
import Example from './example-test-service'

class Bot {
  bot: TelegramBot
  addWord: (msg: any) => any
  addTranslate: (msg: any) => any
  deleteWord: (msg: any) => any
  changeTranslate: (msg: any) => any
  testWordAndAnswer: (
    id: number,
    word: string | null,
    type: 'rus' | 'eng'
  ) => Promise<void>
  addExample: (id: number, text: string) => Promise<void>
  constructor(bot: TelegramBot) {
    this.bot = bot
    this.addWord = this.#addWord.bind(this)
    this.addTranslate = this.#addTranslate.bind(this)
    this.deleteWord = this.#deleteWord.bind(this)
    this.isReg = this.isReg.bind(this)
    this.changeTranslate = this.#changeTranslate.bind(this)
    this.testWordAndAnswer = this.#testWordAndAnswer.bind(this)
    this.addExample = this.#addExample.bind(this)
  }

  async start(msg: Message, id: number = msg.chat.id) {
    let registered: boolean = await mongo.isUserRegistered(id)
    if (!registered) {
      await mongo.registerUser(id)
    }
    this.bot.sendMessage(id, start_text, buttons)
  }

  async help(msg: Message, id: number = msg.chat.id) {
    this.bot.sendMessage(id, help_text, buttons)
  }

  async add(msg: Message, id: number = msg.chat.id) {
    Cache.setUserState(id, 'add1')
    this.bot.sendMessage(id, enterEngWord)
  }

  async change(msg: Message, id: number = msg.chat.id) {
    Cache.setUserState(id, 'change')
    this.bot.sendMessage(id, 'Введите новый перевод')
  }

  async del(msg: Message, id: number = msg.chat.id) {
    Cache.setUserState(id, 'del')
    this.bot.sendMessage(id, del_text)
  }

  async test(msg: Message, id: number = msg.chat.id) {
    Cache.setUserState(id, 'test')
    Cache.delTest(id)
    this.#testWordAndAnswer(id, null, 'eng')
  }

  async test_rus(msg: Message, id: number = msg.chat.id) {
    Cache.setUserState(id, 'test_rus')
    Cache.delTest(id)
    this.#testWordAndAnswer(id, null, 'rus')
  }

  async add_example(msg: Message, id: number = msg.chat.id) {
    const text = await Example.start(id)
    await this.bot.sendMessage(id, text)
  }

  async stop_test(msg: Message, id: number = msg.chat.id) {
    let resultText = await Test.stopTest(id)
    this.bot.sendMessage(id, resultText)
  }

  async isReg(id: number) {
    const cacheReg: boolean = Cache.checkUserRegistered(id)
    if (!cacheReg) {
      Cache.setUserRegistered(id)
      const reg: boolean = await mongo.isUserRegistered(id)
      if (!reg) await mongo.registerUser(id)
    }
  }

  async showDictionary(msg: Message, type: string, id: number = msg.chat.id) {
    await this.isReg(id)
    const [resultString, showFullAbility] = await Dictionary.show(id, type)
    this.bot.sendMessage(
      id,
      resultString,
      showFullAbility ? buttonsWithoutDictFunc(type) : buttonsWithoutDict
    )
  }

  async showFullDictionary(
    msg: Message,
    type: string,
    id: number = msg.chat.id
  ) {
    await this.isReg(id)
    const resultString: string = await Dictionary.showFull(id, type)
    this.bot.sendMessage(id, resultString, buttonsWithoutDict)
  }

  async default(msg: any, id: number = msg.from.id, text: string = msg.text) {
    const state: string = Cache.getStateOfUser(id)
    switch (state) {
      case 'add1':
        this.addWord(msg)
        break

      case 'add2':
        this.addTranslate(msg)
        break

      case 'change':
        this.changeTranslate(msg)
        break

      case 'del':
        this.deleteWord(msg)
        break

      case 'test':
        this.testWordAndAnswer(msg.chat.id, msg.text, 'eng')
        break

      case 'test_rus':
        this.testWordAndAnswer(msg.chat.id, msg.text, 'rus')
        break

      case 'add_example':
        this.#addExample(msg.chat.id, msg.text)
        break
    }
  }

  async errorHandle(err: any) {
    console.log(err)
    //this.bot.sendMessage(msg.chat.id, `Что-то пошло не так :(`)
  }

  async #addWord(msg: any, word: string = msg.text, id: number = msg.chat.id) {
    await this.isReg(id)
    Cache.saveWord1(id, word)
    const isWord: boolean = await Dictionary.isWord(id, word)
    if (isWord) {
      Cache.setUserState(id, null)
      return this.bot.sendMessage(id, is_word_text, buttonsIsWord)
    }
    Cache.setUserState(id, 'add2')
    this.bot.sendMessage(id, enterTranslate)
  }

  async #addTranslate(
    msg: any,
    word: string = msg.text,
    id: number = msg.chat.id
  ) {
    await this.isReg(id)
    Cache.saveWord2(id, word)
    Cache.setUserState(id, null)
    await Dictionary.saveWords(id)
    this.bot.sendMessage(id, success_save, buttonsAfterAdd)
  }

  async #changeTranslate(
    msg: any,
    word: string = msg.text,
    id: number = msg.chat.id
  ) {
    await this.isReg(id)
    Cache.saveWord2(id, word)
    const result: boolean = await Dictionary.changeTranslate(id)
    if (result) {
      Cache.setUserState(id, null)
      return this.bot.sendMessage(id, 'Слово изменено!', buttonsAfterAdd)
    }
    this.bot.sendMessage(id, 'Слово не изменено.', buttonsAfterAdd)
  }

  async #deleteWord(
    msg: any,
    text: string = msg.text,
    id: number = msg.chat.id
  ) {
    await this.isReg(id)
    const deletedWordsNum: number = await Dictionary.deleteWord(id, text)
    Cache.setUserState(id, null)
    if (deletedWordsNum > 0) {
      return this.bot.sendMessage(id, success_delete, buttons)
    }
    return this.bot.sendMessage(id, unsuccess_delete, buttons)
  }

  async #testWordAndAnswer(
    id: number,
    word: string | null,
    type: 'rus' | 'eng'
  ): Promise<void> {
    const result = await Test.testWordAndAnswer(id, word, type)
    for (let i = 0; i < 4; i++) {
      if (result[i]) {
        if (i == 1)
          await this.bot.sendMessage(id, result[i] || 'err', addExampleButton)
        else if (i == 3)
          await this.bot.sendMessage(id, result[i] || 'err', buttonsAfterTest)
        else await this.bot.sendMessage(id, result[i] || 'err')
      }
    }
  }

  async #addExample(id: number, text: string): Promise<void> {
    await Example.add(id, text)
    await this.bot.sendMessage(id, example_added_text)
    const options = await Cache.getTestOptions(id)
    if (options) {
      const result = await Test.testWordAndAnswer(id, null, options.type)
      this.bot.sendMessage(id, result[2] || 'err')
    }
  }
}

export default Bot
