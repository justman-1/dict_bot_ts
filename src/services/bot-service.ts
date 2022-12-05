import mongo from "./mongo-service"
import TelegramBot, {Message} from "node-telegram-bot-api"
const {
  buttons,
  start_text,
  common_error,
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
  test_text,
  enterTranslate, 
  testWord
} = require("../configs/options")
import Cache from "./cache-service"
import Dictionary from "./dictionary-service"
import { WordObj } from "../types"

class Bot {
    bot: TelegramBot
    addWord: (msg: any) => any
    addTranslate: (msg: any) => any
    deleteWord: (msg: any) => any
    changeTranslate: (msg: any) => any
    testWordAndAnswer: (id: number, word: string | null) => Promise<void>
  constructor(bot: TelegramBot) {
    this.bot = bot
    this.addWord = this.#addWord.bind(this)
    this.addTranslate = this.#addTranslate.bind(this)
    this.deleteWord = this.#deleteWord.bind(this)
    this.isReg = this.isReg.bind(this)
    this.changeTranslate = this.#changeTranslate.bind(this)
    this.testWordAndAnswer = this.#testWordAndAnswer.bind(this)
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
    Cache.setUserState(id, "add1")
    this.bot.sendMessage(id, enterEngWord)
  }

  async change(msg: Message, id: number = msg.chat.id) {
    Cache.setUserState(id, "change")
    this.bot.sendMessage(id, "Введите новый перевод")
  }

  async del(msg: Message, id: number = msg.chat.id) {
    Cache.setUserState(id, "del")
    this.bot.sendMessage(id, del_text)
  }

  async test(msg: Message, id: number = msg.chat.id) {
    Cache.setUserState(id, "test")
    this.bot.sendMessage(id, test_text)
    this.#testWordAndAnswer(id, null)
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
    const resultString: string = await Dictionary.show(id, type)
    this.bot.sendMessage(id, resultString, buttonsWithoutDictFunc(type))
  }

  async showFullDictionary(msg: Message, type: string, id: number = msg.chat.id) {
    await this.isReg(id)
    const resultString: string = await Dictionary.showFull(id, type)
    this.bot.sendMessage(id, resultString, buttonsWithoutDict)
  }

  async default(msg: any, id: number = msg.from.id, text: string = msg.text) {
    const state: string = Cache.getStateOfUser(id)
    switch (state) {
      case "add1":
        this.addWord(msg)
        break

      case "add2":
        this.addTranslate(msg)
        break

      case "change":
        this.changeTranslate(msg)
        break

      case "del":
        this.deleteWord(msg)
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
    Cache.setUserState(id, "add2")
    this.bot.sendMessage(id, enterTranslate)
  }

  async #addTranslate(msg: any, word: string = msg.text, id: number = msg.chat.id) {
    await this.isReg(id)
    Cache.saveWord2(id, word)
    Cache.setUserState(id, null)
    await Dictionary.saveWords(id)
    this.bot.sendMessage(id, success_save, buttonsAfterAdd)
  }

  async #changeTranslate(msg: any, word: string = msg.text, id: number = msg.chat.id) {
    await this.isReg(id)
    Cache.saveWord2(id, word)
    const result: boolean = await Dictionary.changeTranslate(id)
    if (result) {
      Cache.setUserState(id, null)
      return this.bot.sendMessage(id, "Слово изменено!", buttonsAfterAdd)
    }
    this.bot.sendMessage(id, "Слово не изменено.", buttonsAfterAdd)
  }

  async #deleteWord(msg: any, text: string = msg.text, id: number = msg.chat.id) {
    await this.isReg(id)
    const deletedWordsNum: number = await Dictionary.deleteWord(id, text)
    if (deletedWordsNum > 0) {
      return this.bot.sendMessage(id, success_delete, buttons)
    }
    return this.bot.sendMessage(id, unsuccess_delete, buttons)
  }

  async #testWordAndAnswer(id: number, word: string | null): Promise<void> {
    if (!word) {
      const wordPairObj: WordObj | undefined | -1 =
        await Dictionary.returnTestWord(id)
      if (wordPairObj != undefined && wordPairObj != -1) {
        this.bot.sendMessage(id, testWord(wordPairObj.words[0]))
      }
      else {
        this.bot.sendMessage(id, common_error)
      }
    }
    else {
      //test word(create new separate func)
      //send new word for test
    }
  }
}

export default Bot
