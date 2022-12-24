import { DictObj, ExampleOptions, TestOptions } from '../types'
import { Cache, CacheClass } from 'memory-cache'
var cacheDict: CacheClass<string, DictObj> = new Cache()
var cacheStr: CacheClass<string, string | null> = new Cache()
var cacheBool: CacheClass<string, boolean> = new Cache()
var cacheTest: CacheClass<string, TestOptions> = new Cache()
var cacheExample: CacheClass<string, ExampleOptions> = new Cache()

class CacheCl {
  setUserState(chat_id: number, state: string | null): void {
    cacheStr.put('state:' + chat_id, state)
  }
  getStateOfUser(chat_id: number): string {
    return cacheStr.get('state:' + chat_id) || ''
  }

  saveWord1(chat_id: number, word: string): void {
    cacheStr.put('word1:' + chat_id, word)
  }
  saveWord2(chat_id: number, word: string): void {
    cacheStr.put('word2:' + chat_id, word)
  }
  getAddWords(chat_id: number): [string, string] | undefined {
    const word: string = cacheStr.get('word1:' + chat_id) || ''
    const translate: string = cacheStr.get('word2:' + chat_id) || ''
    cacheStr.del('word1:' + chat_id)
    cacheStr.del('word2:' + chat_id)
    return [word.toLowerCase(), translate.toLowerCase()]
  }

  setDict(chat_id: number, dict: any[]): void {
    cacheDict.put('dict:' + chat_id, dict)
  }
  getDict(chat_id: number): DictObj | null {
    return cacheDict.get('dict:' + chat_id)
  }

  setUserRegistered(chat_id: number): void {
    cacheBool.put('registered:' + chat_id, true)
  }
  checkUserRegistered(chat_id: number): boolean {
    return cacheBool.get('registered:' + chat_id) ? true : false
  }

  setTestInfo(
    chat_id: number,
    wordsIndexes: number[],
    type: 'rus' | 'eng'
  ): void {
    const newTestOptions: TestOptions = {
      index: 0,
      type: type,
      wordsIndexes: wordsIndexes,
      answered: 0,
      answeredCorrectly: 0,
      answeredWrongly: 0,
      becameFullCorrect: 0
    }
    cacheTest.put('testOptions:' + chat_id, newTestOptions)
  }
  isTest(chat_id: number): boolean {
    return cacheTest.get('testOptions:' + chat_id) != null ? true : false
  }
  getTestIndex(chat_id: number): number | undefined {
    const testOptions = cacheTest.get('testOptions:' + chat_id)
    let index: number | undefined = testOptions?.index
    return index != undefined ? testOptions?.wordsIndexes[index] : undefined
  }
  getTestOptions(chat_id: number): TestOptions | null {
    return cacheTest.get('testOptions:' + chat_id)
  }
  setMoreTestIndex(chat_id: number): boolean {
    const testOptions = cacheTest.get('testOptions:' + chat_id)
    if (testOptions) {
      testOptions.index += 1
      cacheTest.put('testOptions:' + chat_id, testOptions)
    }
    return testOptions
      ? testOptions.wordsIndexes.length > testOptions.index
      : false
  }
  changeAnsweredStates(
    chat_id: number,
    answeredState: boolean,
    fullCorrectState: boolean
  ): void {
    const testOptions = cacheTest.get('testOptions:' + chat_id)
    if (testOptions) {
      testOptions.answered += 1
      if (answeredState) testOptions.answeredCorrectly += 1
      else testOptions.answeredWrongly += 1
      if (fullCorrectState) testOptions.becameFullCorrect += 1
    }
  }
  delTest(chat_id: number): void {
    cacheTest.del('testOptions:' + chat_id)
  }

  setExampleInfo(chat_id: number, type: 'rus' | 'eng', index: number): void {
    const exampleOptions: ExampleOptions = {
      type: type,
      index: index
    }
    cacheExample.put('exampleOptions:' + chat_id, exampleOptions)
  }

  getExampleInfo(chat_id: number): ExampleOptions | null {
    return cacheExample.get('exampleOptions:' + chat_id)
  }
}

export default new CacheCl()
