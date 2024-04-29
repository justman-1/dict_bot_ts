import { Definition, DictObj } from '../types'
import stringSimilarity from 'string-similarity'

class Forming {
  formDeleteRangesToArray: any
  shuffleArray: (array: DictObj) => DictObj
  //lemRu: (word: string) => string
  constructor() {
    this.formDeleteRangesToArray = this.#formDeleteRangesToArray.bind(this)
    this.shuffleArray = this.#shuffleArray.bind(this)
    //this.lemRu = this.#lemRu.bind(this)
  }

  formWordsShowToString(
    dict: DictObj,
    wordsIndex: number,
    type: string
  ): string {
    let wordsStr = `${
      type == 'default'
        ? 'Ваш словарь'
        : type == 'eng'
        ? 'Английские слова из вашего словаря'
        : 'Переводы слов из вашего словаря'
    }: \n`
    dict.forEach((part, index) => {
      const state_eng: string =
        part.tested_eng == 0 ? '' : part.tested_eng == 1 ? ' ⚪' : ' ✅'
      const state_rus: string =
        part.tested_rus == 0 ? '' : part.tested_rus == 1 ? ' ⚪' : ' ✅'
      const state = state_eng + state_rus
      wordsStr +=
        +index +
        +1 +
        +wordsIndex +
        '. ' +
        (type == 'default'
          ? part.words[0] + ' - ' + part.words[1] + state
          : type == 'eng'
          ? part.words[0] + state
          : part.words[1] + state) +
        ' \n'
    })
    return wordsStr
  }

  formDeleteIndexesToArray(
    indexesStr: string,
    dict: DictObj | Definition[]
  ): number[] {
    let indexes: number[] = []
    const numbers: any[] = indexesStr
      .split(' ')
      .filter((index) => {
        return !/\D/.test(index)
      })
      .map((index) => parseInt(index))
    const rangesIndexes: number[] = this.formDeleteRangesToArray(indexesStr)
    indexes = numbers
      .concat(rangesIndexes)
      .map((index) => index - 1)
      .filter((el, i) => {
        return el < dict.length && el >= 0
      })
      .sort((a, b) => b - a)
    let result: number[] = []
    indexes.forEach((e) => {
      if (result.indexOf(e) == -1) {
        result.push(e)
      }
    })
    return result
  }

  formTestWordsIndexesArr(words: DictObj, langType: 'rus' | 'eng'): number[] {
    let notChecked: DictObj = words.map((e, i) => {
      e.index = i
      return e
    })
    let checkedWith1: DictObj
    let checkedWith0: DictObj
    const isEng = langType == 'eng'
    checkedWith0 = this.shuffleArray(
      notChecked.filter((e) => (isEng ? e.tested_eng : e.tested_rus) == 0)
    )
    checkedWith1 = this.shuffleArray(
      notChecked.filter((e) => (isEng ? e.tested_eng : e.tested_rus) == 1)
    )
    let x = Math.floor(checkedWith0.length / (checkedWith1.length + 1)) //коэффициент
    let result = this.shuffleArray(checkedWith0)
    let i = x
    let wordIndex = 0
    if (x != 0) {
      x += 1
      while (i < result.length && wordIndex < checkedWith1.length) {
        result.splice(i, 0, checkedWith1[wordIndex])
        i += x
        wordIndex += 1
      }
    } else {
      while (i < result.length && wordIndex < checkedWith1.length) {
        result.splice(i, 0, checkedWith1[wordIndex])
        i += 3
        wordIndex += 1
      }
      if (wordIndex < checkedWith1.length) {
        result = result.concat(checkedWith1.slice(wordIndex))
      }
    }
    return result.map((e) => e.index || 0)
  }

  areWordsSimilar(word1: string, word2: string): boolean {
    const similarity = stringSimilarity.compareTwoStrings(word1, word2)
    return similarity >= 0.75
  }

  /**#lemRu(word: string): string {
    return stemmer.stem(tokenizer.tokenize(word)[0])
  }**/

  formDefsShowToString(defs: Definition[], defsIndex: number): string {
    let defsStr = `Ваши определения: \n`
    defs.forEach((part, index) => {
      defsStr +=
        +index +
        +1 +
        +defsIndex +
        '. ' +
        part.word +
        ' - ' +
        part.definition +
        ' \n'
    })
    return defsStr
  }

  #formDeleteRangesToArray(indexesStr: string): number[] {
    const ranges: (number[] | undefined)[] =
      indexesStr
        .split(' ')
        .filter((e) => e.match(/(\d+)-(\d+)/))
        .map((e) => {
          const dashI = e.indexOf('-')
          let num1: string = e.slice(0, dashI)
          let num2: string = e.slice(dashI + 1)
          const isNumsCondition =
            num1 !== '' || num2 !== '' || !/\D/.test(num1) || !/\D/.test(num2)
          if (isNumsCondition) {
            let num11: number = parseInt(num1)
            let num22: number = parseInt(num2)
            if (num11 < num22) {
              num22 += 1
              let rangesIndexes = []
              for (let i = num11; i < num22; i++) {
                rangesIndexes.push(i)
              }
              return rangesIndexes
            } else if (num11 > num22) {
              num1 += 1
              let rangesIndexes = []
              for (let i = num22; i < num11; i++) {
                rangesIndexes.push(i)
              }
              return rangesIndexes
            }
          }
        }) || []
    let rangesIndexes: number[] = []
    for (let i = 0; i < ranges.length; i++) {
      rangesIndexes = rangesIndexes.concat(ranges[i] || [])
    }
    return rangesIndexes
  }

  #shuffleArray(array: DictObj): DictObj {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }
}

export default new Forming()
