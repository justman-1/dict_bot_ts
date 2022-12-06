import { DictObj, TestOptions } from '../types'
import { Cache, CacheClass } from 'memory-cache'
var cacheDict: CacheClass<string, DictObj> = new Cache()
var cacheStr: CacheClass<string, string | null> = new Cache()
var cacheBool: CacheClass<string, boolean> = new Cache()
var cacheTest: CacheClass<string, TestOptions> = new Cache()

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

  setTestInfo(chat_id: number, wordsIndexes: number[]): void {
    const newTestOptions: TestOptions = {
      index: 0,
      wordsIndexes: wordsIndexes,
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
    console.log(testOptions)
    let index: number | undefined = testOptions?.index
    return index != undefined ? testOptions?.wordsIndexes[index] : undefined
  }
  getTestOptions(chat_id: number): TestOptions | null {
    return cacheTest.get('testOptions:' + chat_id)
  }
  setMoreTestIndex(chat_id: number): boolean {
    const testOptions = cacheTest.get('testOptions:' + chat_id)
    console.log('add test index')
    if (testOptions) {
      testOptions.index += 1
      cacheTest.put('testOptions:' + chat_id, testOptions)
    }
    return testOptions
      ? testOptions.wordsIndexes.length > testOptions.index
      : false
  }
  delTest(chat_id: number): void {
    cacheTest.del('testOptions:' + chat_id)
  }
}

export default new CacheCl()
