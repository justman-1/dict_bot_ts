import { UserObj, WordObj } from '../types/index'
import mongoose, { Schema, Model, Types } from 'mongoose'
const { DB_HOST } = process.env
console.log(DB_HOST)

let mongoPath = (dbName: string) => {
  return `mongodb+srv://user1:user@example.7j3yd.mongodb.net/${dbName}?retryWrites=true&w=majority`
}

interface User1 {
  _id: Types.ObjectId
  id: string
  dict: [Types.DocumentArray<WordObj>]
}

const userScheme = new Schema({
  id: { type: Number, required: true },
  dict: {
    type: [
      {
        words: { type: [String, String], required: true },
        tested_eng: { type: Number, required: true, default: 0 },
        tested_rus: { type: Number, required: true, default: 0 },
        example_eng: { type: String, required: true, default: '' },
        example_rus: { type: String, required: true, default: '' }
      }
    ],
    required: true
  }
})

const User = mongoose.model('User', userScheme)

class Connect {
  constructor() {
    this.remoteConnect = this.remoteConnect.bind(this)
    this.localConnect = this.localConnect.bind(this)
  }

  async remoteConnect(dbName: string): Promise<void> {
    await mongoose.connect(mongoPath(dbName)).then((MongoClient: any) => {
      try {
        console.log('Connected to mongoDB!')
      } finally {
      }
    })
  }

  async localConnect(dbName: string): Promise<void> {
    await mongoose.connect(`mongodb://${DB_HOST}:27017/${dbName}`)
  }

  async connectToMongoDb(dbName: string): Promise<void> {
    this.remoteConnect(dbName)
    //this.localConnect(dbName)
  }

  async importDb(from: string, to: string): Promise<void> {
    await this.remoteConnect(from)
    let data: any = await User.find({})
    await mongoose.connection.close()
    await this.localConnect(to)
    data = data.map((user: UserObj) => {
      const user2 = {
        id: user.id,
        dict: user.dict
      }
      return user2
    })
    User.create(data)
  }
}

const connect = new Connect()
//connect.remoteConnect('dictionary_bot_ts')
connect.localConnect('DICTINARY_BOT_TS')

export default User
