import { DictObj } from '../types'

class Forming {
  formDeleteRangesToArray: any
  constructor() {
    this.formDeleteRangesToArray = this.#formDeleteRangesToArray.bind(this)
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
    }${wordsIndex != 0 ? '(последние 30 слов)' : ''}: \n`
    dict.forEach((part, index) => {
      const state: string =
        part.tested == 0 ? '' : part.tested == 1 ? ' ⚪' : ' ✅'
      wordsStr +=
        +index +
        +1 +
        wordsIndex +
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

  formDeleteIndexesToArray(indexesStr: string, dict: DictObj): number[] {
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

  formTestWordsIndexesArr(words: DictObj): number[] {
    const notChecked: DictObj = words
      .map((e, i) => {
        e.index = i
        return e
      })
      .filter((e) => e.tested < 2)
    let numOfNullTested: number = //we check pairs with 0 index
      notChecked.length >= 25 && notChecked.length <= 50
        ? Math.floor(notChecked.length * 0.2)
        : notChecked.length <= 25 && notChecked.length >= 5
        ? 5
        : notChecked.length < 5
        ? notChecked.length
        : 10
    let testedBeforeIndex: number = 0 //for separatly display half-checked words
    let addedOnStart: string[][] = []
    var testWordsIndexes: number[] = notChecked
      .sort((a, b) => {
        if (numOfNullTested > 0) {
          if (a.tested == 0) {
            //at start 0
            const state = addedOnStart.find((e) => e == a.words)
            if (!state) {
              numOfNullTested -= 1
              addedOnStart.push(a.words)
            }
            return -1
          } else {
            //half-checked words
            return 1
          }
        } else {
          return b.tested - a.tested
        }
      })
      .map((e) => {
        return e?.index || 0
      })
    return testWordsIndexes
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
}

export default new Forming()
