import { DictObj, WordObj, WordsGetObj } from '../types'

import mongo from './mongo-service'
import Cache from './cache-service'
import Forming from './forming-service'

class Dictionary {
  getDictionaryObj: (id: number) => Promise<DictObj>
  getLast30Words: (id: number) => Promise<WordsGetObj>
  getAllWords: (id: number) => Promise<DictObj>
  saveDictionary: (id: number, dict: DictObj) => Promise<void>
  constructor() {
    this.getDictionaryObj = this.#getDictionaryObj.bind(this)
    this.getLast30Words = this.#getLast30Words.bind(this)
    this.getAllWords = this.#getAllWords.bind(this)
    this.saveDictionary = this.#saveDictionary.bind(this)
  }

  async show(id: number, type: string): Promise<[string, boolean]> {
    const { words, wordsIndex, moreThan30 }: WordsGetObj =
      await this.getLast30Words(id)
    if (words && words.length != 0) {
      let wordsStr: string = Forming.formWordsShowToString(
        words,
        wordsIndex,
        type
      )
      return [wordsStr, moreThan30]
    } else {
      return ['Ваш словарь пуст', false]
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
    const moreThan30 = words.length > 30
    const index: number = moreThan30 ? words.length - 30 : 0
    words = words.slice(index)
    return {
      words: words ? words : null,
      wordsIndex: index,
      moreThan30: moreThan30
    }
  }

  async #getAllWords(id: number): Promise<DictObj> {
    let words: DictObj = await this.getDictionaryObj(id)
    return words
  }
}

export default new Dictionary()
