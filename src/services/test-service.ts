import Dictionary from './dictionary-service'
import Forming from './forming-service'
import Cache from './cache-service'
import { WordObj, DictObj } from '../types'
const {
  test_text,
  testWord,
  test_positive_reaction,
  testNegativeReaction,
  testResults,
  test_all_checked,
  test_end
} = require('../configs/options')

class Test {
  getTestResults: (id: number) => string
  returnTestWord: (id: number) => Promise<WordObj | undefined | -1>
  testWord: (
    id: number,
    word: string,
    wordPairCheck: WordObj,
    type: 'rus' | 'eng'
  ) => Promise<[boolean, string | null]>
  prepareTest: (id: number, type: 'rus' | 'eng') => Promise<void>
  getTestWord: (id: number, words: DictObj) => WordObj | -1 | undefined
  addTestedIndex: (
    id: number,
    wordIndex: number,
    addOrNot: boolean,
    type: 'rus' | 'eng'
  ) => Promise<number>
  constructor() {
    this.getTestResults = this.#getTestResults.bind(this)
    this.returnTestWord = this.#returnTestWord.bind(this)
    this.testWord = this.#testWord.bind(this)
    this.prepareTest = this.#prepareTest.bind(this)
    this.getTestWord = this.#getTestWord.bind(this)
    this.addTestedIndex = this.#addTestedIndex.bind(this)
  }
  /*[
    startText: null | string,
    checkedResultText: null | string,
    newWordText: null | string,
    results?: string | false
  ]*/

  async testWordAndAnswer(
    id: number,
    word: string | null,
    type: 'eng' | 'rus'
  ): Promise<[null | string, null | string, null | string, string | false]> {
    var wordPairForCompare: WordObj | undefined | -1 =
      await this.returnTestWord(id)
    if (!word) {
      if (wordPairForCompare != undefined && wordPairForCompare != -1) {
        const word2 = wordPairForCompare.words[type == 'eng' ? 0 : 1]
        const example =
          type == 'eng'
            ? wordPairForCompare.example_eng
            : wordPairForCompare.example_rus
        console.log(wordPairForCompare)
        return [null, null, testWord(word2, example), false]
      } else {
        this.prepareTest(id, type)
        wordPairForCompare = await this.returnTestWord(id)
        if (wordPairForCompare && wordPairForCompare != -1) {
          const word2 = wordPairForCompare.words[type == 'eng' ? 0 : 1]
          const example =
            type == 'eng'
              ? wordPairForCompare.example_eng
              : wordPairForCompare.example_rus
          console.log(wordPairForCompare)
          return [test_text, null, testWord(word2, example), false]
        } else {
          Cache.setUserState(id, null)
          return [null, null, null, test_all_checked]
        }
      }
    } else if (wordPairForCompare && wordPairForCompare != -1) {
      const [testWordResult, correctAnswer] = await this.testWord(
        id,
        word,
        wordPairForCompare,
        type
      )
      const moreIndexState: boolean = Cache.setMoreTestIndex(id)
      let results: string | null = null
      if (!moreIndexState) {
        results = this.#getTestResults(id)
        results = results == '' ? test_end : results
        Cache.setUserState(id, null)
        Cache.delTest(id)
      }
      wordPairForCompare = await this.returnTestWord(id)
      if (wordPairForCompare && wordPairForCompare != -1) {
        const word2 = wordPairForCompare.words[type == 'eng' ? 0 : 1]
        const example =
          type == 'eng'
            ? wordPairForCompare.example_eng
            : wordPairForCompare.example_rus
        console.log(wordPairForCompare)
        return [
          null,
          testWordResult
            ? test_positive_reaction
            : testNegativeReaction(correctAnswer),
          testWord(word2, example),
          false
        ]
      } else {
        return [
          null,
          testWordResult
            ? test_positive_reaction
            : testNegativeReaction(correctAnswer),
          null,
          results ? results : 'end'
        ]
      }
    } else if (wordPairForCompare == -1) {
      //end test
      let results = this.#getTestResults(id)
      results = results == '' ? test_end : results
      Cache.setUserState(id, null)
      Cache.delTest(id)
      return [null, null, null, results]
    } else {
      return [null, null, null, test_end]
    }
  }

  async stopTest(id: number): Promise<string> {
    let resultText = this.#getTestResults(id)
    resultText = resultText == '' ? 'Ваш тест окончен!' : resultText
    Cache.setUserState(id, null)
    Cache.delTest(id)
    return resultText
  }

  #getTestResults(id: number): string {
    const testOptions = Cache.getTestOptions(id)
    return testOptions != null
      ? testResults(
          testOptions?.answered || 0,
          testOptions?.answeredCorrectly || 0,
          testOptions?.becameFullCorrect || 0
        )
      : ''
  }
  async #returnTestWord(id: number): Promise<WordObj | undefined | -1> {
    let words: DictObj = await Dictionary.getDictionaryObj(id)
    const isTest: boolean = Cache.isTest(id)
    if (!isTest) {
      return undefined
    }
    return this.getTestWord(id, words)
  }

  async #testWord(
    id: number,
    word: string,
    wordPairCheck: WordObj,
    type: 'rus' | 'eng'
  ): Promise<[boolean, string | null]> {
    word = word.toLowerCase()
    let wordsCheck = wordPairCheck.words[type == 'eng' ? 1 : 0].split('/')
    let testSucceed: boolean = wordsCheck.find((e) => e == word) ? true : false
    if (testSucceed) {
      if (wordPairCheck.index != undefined) {
        const newIndex = await this.addTestedIndex(
          id,
          wordPairCheck.index,
          true,
          type
        )
        Cache.changeAnsweredStates(id, testSucceed, newIndex == 2)
      }
      return [true, null]
    } else {
      if (wordPairCheck.index != undefined) {
        const newIndex = await this.addTestedIndex(
          id,
          wordPairCheck.index,
          false,
          type
        )
        Cache.changeAnsweredStates(id, testSucceed, newIndex == 2)
      }
      return [false, wordPairCheck.words[type == 'eng' ? 1 : 0]]
    }
  }

  async #prepareTest(id: number, type: 'rus' | 'eng'): Promise<void> {
    let words: DictObj = await Dictionary.getDictionaryObj(id)
    var testWordsIndexes = Forming.formTestWordsIndexesArr(words, type)
    Cache.setTestInfo(id, testWordsIndexes, type)
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
    addOrNot: boolean,
    type: 'rus' | 'eng'
  ): Promise<number> {
    let words: DictObj = await Dictionary.getDictionaryObj(id)
    if (type == 'eng')
      words[wordIndex].tested_eng = addOrNot
        ? words[wordIndex].tested_eng + 1
        : 0
    else
      words[wordIndex].tested_rus = addOrNot
        ? words[wordIndex].tested_rus + 1
        : 0
    Dictionary.saveDictionary(id, words)
    return type == 'eng'
      ? words[wordIndex].tested_eng
      : words[wordIndex].tested_rus
  }
}

export default new Test()
