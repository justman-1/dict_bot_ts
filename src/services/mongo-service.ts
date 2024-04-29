import { Definition, DictObj, WordObj } from '../types'

import User from '../configs/mongo'

class Mongo {
  User: any
  constructor() {
    this.User = User
  }

  async isUserRegistered(id: number): Promise<boolean> {
    const result: { id: string } | null = await User.findOne({ id: id }, ['id'])
    return result ? true : false
  }

  async registerUser(id: number): Promise<void> {
    await User.create({ id: id, dict: [] })
  }

  async saveDictionary(id: number, dict: DictObj): Promise<void> {
    await User.updateOne({ id: id }, { dict: dict })
  }

  async getDict(id: number): Promise<DictObj | null> {
    const user = await User.findOne({ id: id }, ['dict'])
    return user ? user.dict : null
  }

  async saveDefs(id: number, defs: Definition[]): Promise<void> {
    await User.updateOne({ id: id }, { definitions: defs })
  }

  async getDefs(id: number): Promise<Definition[] | null> {
    const user = await User.findOne({ id: id }, ['definitions'])
    return user ? user.definitions : null
  }
}

export default new Mongo()
