export interface WordObj{
    words: string[],
    tested: number, 
    index?: number
}
export interface DictObj extends Array<WordObj>{}
export interface UserObj{
    id: string,
    dict: WordObj[],
}
export interface WordsGetObj{
    words: DictObj | null,
    wordsIndex: number,
}
export interface TestOptions{
    index: number,//i
    wordsIndexes: number[]//array[i] = index of word pair
  }