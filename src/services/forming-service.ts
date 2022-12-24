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
      const state_eng: string =
        part.tested_eng == 0 ? '' : part.tested_eng == 1 ? ' ⚪' : ' ✅'
      const state_rus: string =
        part.tested_rus == 0 ? '' : part.tested_rus == 1 ? ' ⚪' : ' ✅'
      const state = state_eng + state_rus
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

  formTestWordsIndexesArr(words: DictObj, langType: 'rus' | 'eng'): number[] {
    let notChecked: DictObj = words.map((e, i) => {
      e.index = i
      return e
    })
    let checkedWith1: DictObj
    let checkedWith0: DictObj
    if (langType == 'eng') {
      checkedWith1 = notChecked.filter((e) => e.tested_eng == 1)
      checkedWith0 = notChecked.filter((e) => e.tested_eng == 0)
      notChecked = notChecked.filter((e) => e.tested_eng < 2)
    } else {
      checkedWith1 = notChecked.filter((e) => e.tested_rus == 1)
      checkedWith0 = notChecked.filter((e) => e.tested_rus == 0)
      notChecked = notChecked.filter((e) => e.tested_rus < 2)
    }
    let numOfNullTested: number = //we check pairs with 0 index
      notChecked.length >= 25 && notChecked.length <= 50
        ? Math.floor(notChecked.length * 0.2)
        : notChecked.length <= 25 && notChecked.length >= 5
        ? 5
        : notChecked.length < 5
        ? notChecked.length
        : 10
    let result = checkedWith0
    result = result.concat(checkedWith1) //2 step
    if (numOfNullTested < checkedWith0.length) {
      result.unshift.apply(checkedWith0.slice(0, numOfNullTested)) //1 step
      result.push.apply(checkedWith0.slice(numOfNullTested)) //3step
    } else {
      result.unshift.apply(checkedWith0)
    }
    const resultIndexes = result.map((e) => {
      return e?.index || 0
    })
    console.log(resultIndexes)
    return resultIndexes
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
