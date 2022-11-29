import { DictObj } from "../types"

class Forming {
    formDeleteRangesToArray: any
    constructor() {
      this.formDeleteRangesToArray = this.#formDeleteRangesToArray.bind(this)
    }
  
    formWordsShowToString(dict: DictObj, wordsIndex: number, type: string): string {
      let wordsStr = `${
        type == "default"
          ? "Ваш словарь"
          : type == "eng"
          ? "Английские слова из вашего словаря"
          : "Переводы слов из вашего словаря"
      }${wordsIndex != 0 ? "(последние 30 слов)" : ""}: \n`
      dict.forEach((part, index) => {
        wordsStr +=
          +index +
          +1 +
          wordsIndex +
          ". " +
          (type == "default"
            ? part.words[0] + " - " + part.words[1]
            : type == "eng"
            ? part.words[0]
            : part.words[1]) +
          " \n"
      })
      return wordsStr
    }
  
    formDeleteIndexesToArray(indexesStr: string, dict: DictObj): number[] {
      let indexes: number[] = []
      const numbers: any[] = indexesStr
        .split(" ")
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
      indexes.forEach(e => {
        if (result.indexOf(e) == -1) {
          result.push(e)
        }
      })
      return result
    }
  
    #formDeleteRangesToArray(indexesStr: string): number[] {
      const ranges: any = indexesStr
        .split(" ")
        .filter((e) => e.match(/(\d+)-(\d+)/))
        .map((e) => {
          const dashI = e.indexOf("-")
          let num1: string = e.slice(0, dashI)
          let num2: string = e.slice(dashI + 1)
          const isNumsCondition =
            num1 !== "" || num2 !== "" || !/\D/.test(num1) || !/\D/.test(num2)
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
          rangesIndexes = rangesIndexes.concat(ranges[i])
      }
      return rangesIndexes
    }
  }
  
export default new Forming()
  