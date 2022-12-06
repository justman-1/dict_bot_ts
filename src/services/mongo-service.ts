import { DictObj, WordObj } from '../types'

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
}

export default new Mongo()
