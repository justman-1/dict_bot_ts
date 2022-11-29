import { DictObj } from "../types"

import User from "../configs/mongo"

class Mongo {
    User: any
  constructor() {
    this.User = User
  }

  async isUserRegistered(id: number): Promise<boolean>{
    const result = await User.findOne({ id: id }, ["id"])
    return result
  }

  async registerUser(id: number): Promise<void> {
    await User.create({ id: id, words: [] })
  }

  async saveDictionary(id: number, dict: DictObj): Promise<void> {
    await User.updateOne({ id: id }, { words: dict })
  }

  async getDict(id: number): Promise<DictObj> {
    let words = (await User.findOne({ id: id }, ["dict"])).dict
    return words
  }
}

export default new Mongo()
