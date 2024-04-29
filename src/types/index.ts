export interface WordObj {
  words: string[]
  tested_eng: number
  tested_rus: number
  example_eng: string
  example_rus: string
  checked: number
  date: Date
  index?: number
}
export interface DictObj extends Array<WordObj> {}
export interface UserObj {
  id: string
  dict: WordObj[]
}
export interface WordsGetObj {
  words: DictObj | null
  wordsIndex: number
  moreThan30: boolean
}
export interface DefsGetObj {
  defs: Definition[] | null
  defsIndex: number
  moreThan30: boolean
}
export interface TestOptions {
  type: 'rus' | 'eng'
  index: number //i
  wordsIndexes: number[] //array[i] = index of word pair
  answered: number
  answeredCorrectly: number
  answeredWrongly: number
  becameFullCorrect: number
}
export interface ExampleOptions {
  type: 'rus' | 'eng'
  index: number
}
export interface Definition {
  word: string
  definition: string
  synonyms: string[]
}
