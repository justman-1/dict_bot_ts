import Dictionary from './dictionary-service'
import Forming from './forming-service'
import Cache from './cache-service'
const { addExampleText } = require('../configs/options')

class Example {
  async start(id: number): Promise<string> {
    Cache.setUserState(id, 'add_example')
    const testInfo = Cache.getTestOptions(id)
    if (testInfo) {
      const { type, index, wordsIndexes } = testInfo
      Cache.setExampleInfo(id, type, wordsIndexes[index - 1])
      let dict = await Dictionary.getDictionaryObj(id)
      return addExampleText(
        dict[wordsIndexes[index - 1]].words[type == 'eng' ? 0 : 1]
      )
    }
    return 'err'
  }

  async add(id: number, text: string): Promise<void> {
    const exampleInfo = Cache.getExampleInfo(id)
    if (exampleInfo) {
      const { type, index } = exampleInfo
      let dict = await Dictionary.getDictionaryObj(id)
      if (type == 'eng') dict[index].example_eng = text
      else dict[index].example_rus = text
      await Dictionary.saveDictionary(id, dict)
      Cache.setUserState(id, type == 'eng' ? 'test' : 'test_rus')
    }
  }
}

export default new Example()
