import { DictObj, WordObj, WordsGetObj } from '../types'

import mongo from './mongo-service'
import Cache from './cache-service'
import Forming from './forming-service'

class Dictionary {
  getDictionaryObj: (id: number) => Promise<DictObj>
  getLast30Words: (id: number) => Promise<WordsGetObj>
  getAllWords: (id: number) => Promise<DictObj>
  saveDictionary: (id: number, dict: DictObj) => Promise<void>
  getTestWord: (id: number, words: DictObj) => WordObj | -1 | undefined
  addTestedIndex: (
    id: number,
    wordIndex: number,
    addOrNot: boolean
  ) => Promise<void>
  constructor() {
    this.getDictionaryObj = this.#getDictionaryObj.bind(this)
    this.getLast30Words = this.#getLast30Words.bind(this)
    this.getAllWords = this.#getAllWords.bind(this)
    this.saveDictionary = this.#saveDictionary.bind(this)
    this.getTestWord = this.#getTestWord.bind(this)
    this.addTestedIndex = this.#addTestedIndex.bind(this)
    this.prepareTest = this.prepareTest.bind(this)
  }

  async show(id: number, type: string): Promise<string> {
    const { words, wordsIndex }: WordsGetObj = await this.getLast30Words(id)
    if (words && words.length != 0) {
      let wordsStr: string = Forming.formWordsShowToString(
        words,
        wordsIndex,
        type
      )
      return wordsStr
    } else {
      return 'Ваш словарь пуст'
    }
  }

  async showFull(id: number, type: string): Promise<string> {
    const words: DictObj = await this.getAllWords(id)
    if (words && words.length != 0) {
      let wordsStr: string = Forming.formWordsShowToString(words, 0, type)
      return wordsStr
    } else {
      return 'Ваш словарь пуст'
    }
  }

  async isWord(id: number, word: string): Promise<boolean> {
    const words: DictObj = await this.getDictionaryObj(id)
    const result: WordObj | undefined = words.find((e) => {
      return e.words[0] == word.toLowerCase()
    })
    return result ? true : false
  }

  async saveWords(id: number): Promise<void> {
    let dict: DictObj = await this.getDictionaryObj(id)
    let addWords: [string, string] | undefined = Cache.getAddWords(id)
    if (addWords) {
      const newWordsPair: WordObj = {
        words: addWords,
        tested: 0
      }
      dict.push(newWordsPair)
      this.saveDictionary(id, dict)
    }
  }

  async changeTranslate(id: number): Promise<boolean> {
    let dict: DictObj = await this.getDictionaryObj(id)
    const wordsToChange: [string, string] | undefined = Cache.getAddWords(id)
    if (wordsToChange) {
      const index = dict.findIndex((e) => {
        return e.words[0] == wordsToChange[0]
      })
      if (index != -1) {
        dict[index].words[1] = wordsToChange[1]
        this.saveDictionary(id, dict)
        return true
      }
    }
    return false
  }

  async deleteWord(id: number, indexesStr: string): Promise<number> {
    let words: DictObj = await this.getDictionaryObj(id)
    const indexes: number[] = Forming.formDeleteIndexesToArray(
      indexesStr,
      words
    )
    indexes.forEach((index) => {
      words.splice(index, 1)
    })
    this.saveDictionary(id, words)
    return indexes.length
  }

  async returnTestWord(id: number): Promise<WordObj | undefined | -1> {
    let words: DictObj = await this.getDictionaryObj(id)
    const isTest: boolean = Cache.isTest(id)
    if (!isTest) {
      await this.prepareTest(id)
    }
    return this.getTestWord(id, words)
  }

  async testWord(
    id: number,
    word: string,
    wordPairCheck: WordObj
  ): Promise<boolean> {
    console.log(word)
    let wordsCheck = wordPairCheck.words[1].split('/')
    console.log(wordsCheck)
    let testSucceed: boolean = wordsCheck.find((e) => e == word) ? true : false
    if (testSucceed) {
      console.log(wordPairCheck)
      if (wordPairCheck.index != undefined) {
        await this.addTestedIndex(id, wordPairCheck.index, true)
      }
      return true
    } else {
      if (wordPairCheck.index != undefined) {
        await this.addTestedIndex(id, wordPairCheck.index, false)
      }
      return false
    }
  }

  async prepareTest(id: number): Promise<void> {
    let words: DictObj = await this.getDictionaryObj(id)
    console.log(words)
    var testWordsIndexes = Forming.formTestWordsIndexesArr(words)
    Cache.setTestInfo(id, testWordsIndexes)
  }

  async #getDictionaryObj(id: number): Promise<DictObj> {
    var dict: DictObj | null = Cache.getDict(id)
    if (!dict) {
      dict = await mongo.getDict(id)
      if (!dict) throw new Error('mongo error maybe')
      Cache.setDict(id, dict)
      return dict
    }
    return dict
  }

  async #saveDictionary(id: number, dict: DictObj): Promise<void> {
    Cache.setDict(id, dict)
    await mongo.saveDictionary(id, dict)
  }

  async #getLast30Words(id: number): Promise<WordsGetObj> {
    let words: DictObj = await this.getDictionaryObj(id)
    const index: number = words.length > 30 ? words.length - 30 : 0
    words = words.slice(index)
    return {
      words: words ? words : null,
      wordsIndex: index
    }
  }

  async #getAllWords(id: number): Promise<DictObj> {
    let words: DictObj = await this.getDictionaryObj(id)
    return words
  }

  #getTestWord(id: number, words: DictObj): WordObj | -1 | undefined {
    const index = Cache.getTestIndex(id)
    if (index != undefined) {
      return words[index] || -1
    }
    return undefined
  }

  async #addTestedIndex(
    id: number,
    wordIndex: number,
    addOrNot: boolean
  ): Promise<void> {
    let words: DictObj = await this.getDictionaryObj(id)
    console.log('add word index')
    words[wordIndex].tested = addOrNot ? words[wordIndex].tested + 1 : 0
    this.saveDictionary(id, words)
  }
}

export default new Dictionary()
