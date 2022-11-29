export interface WordObj{
    words: [string, string],
    tested: number
}
export interface DictObj extends Array<WordObj>{}
export interface UserObj{
    id: string,
    dict: [WordObj],
}
export interface WordsGetObj{
    words: DictObj | null,
    wordsIndex: number,
  }