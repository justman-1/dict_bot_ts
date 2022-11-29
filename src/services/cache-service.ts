import { DictObj } from "../types"

const NodeCache = require("node-cache")
const cache = new NodeCache()

class Cache {
  setUserState(chat_id: number, state: string | null): void {
    cache.set("state:" + chat_id, state)
  }
  getStateOfUser(chat_id: number): string {
    return cache.get("state:" + chat_id)
  }
  saveWord1(chat_id: number, word: string): void {
    cache.set("word1:" + chat_id, word)
  }
  saveWord2(chat_id: number, word: string): void {
    cache.set("word2:" + chat_id, word)
  }
  getAddWords(chat_id: number): [string, string] | undefined {
    const word = cache.take("word1:" + chat_id)
    const translate = cache.take("word2:" + chat_id)
    return [word.toLowerCase(), translate.toLowerCase()]
  }
  setDict(chat_id: number, dict: DictObj): void {
    cache.set("dict:" + chat_id, dict)
  }
  getDict(chat_id: number): DictObj | undefined {
    return cache.get("dict:" + chat_id)
  }
  setUserRegistered(chat_id: number): void {
    cache.set("registered:" + chat_id, true)
  }
  checkUserRegistered(chat_id: number): boolean {
    return cache.get("registered:" + chat_id)
  }
}

export default new Cache()
