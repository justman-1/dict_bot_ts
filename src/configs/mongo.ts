import { UserObj, WordObj } from '../types/index'
import mongoose, { Schema, Model, Types } from 'mongoose'
const { DB_HOST } = process.env

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
        tested_eng: { type: Number, default: 0 },
        tested_rus: { type: Number, default: 0 },
        example_eng: { type: String, default: '' },
        example_rus: { type: String, default: '' },
        checked: { type: Number, default: 0 },
        date: { type: Date, default: new Date() }
      }
    ],
    required: true,
    default: []
  },
  definitions: {
    type: [
      {
        word: { type: String, default: '' },
        definition: { type: String, default: '' },
        synonyms: { type: Array, default: [] }
      }
    ],
    required: true,
    default: []
  }
})

const User = mongoose.model('User', userScheme)

class Connect {
  constructor() {
    this.remoteConnect = this.remoteConnect.bind(this)
    this.localConnect = this.localConnect.bind(this)
  }

  async remoteConnect(dbName: string): Promise<void> {
    await mongoose.connect(mongoPath(dbName)).then(async (MongoClient: any) => {
      try {
        console.log('Connected to mongoDB!')
      } catch (err) {
        console.log('have not connected')
        console.log(err)
      }
    })
  }

  async localConnect(dbName: string): Promise<void> {
    await mongoose.connect(`mongodb://${DB_HOST}:27017/${dbName}`)
  }

  async importDb(from: string, to: string): Promise<void> {
    console.log('recieve data...')
    await this.remoteConnect(from)
    let data: any = await User.find({})
    console.log(JSON.stringify(data))
    console.log('recieved')
    await mongoose.connection.close()
    await this.localConnect(to)
    await User.deleteMany({})
    data = data.map((user: UserObj) => {
      const user2 = {
        id: user.id,
        dict: user.dict
      }
      return user2
    })
    User.insertMany(data, (err) => {
      if (!err) console.log('imported.')
    })
  }

  async exportDb(from: string, to: string): Promise<void> {
    console.log('recieve data...')
    await this.localConnect(from)
    let data: any = await User.find({})
    console.log('recieved')
    await mongoose.connection.close()
    await this.remoteConnect(to)
    await User.deleteMany({})
    data = data.map((user: UserObj) => {
      const user2 = {
        id: user.id,
        dict: user.dict
      }
      return user2
    })
    User.insertMany(data, (err) => {
      if (!err) console.log('exported.')
    })
  }

  async showAllUsers() {
    //929651012
    const users = await User.find()
    console.log(users[0].dict)
  }
}

const connect = new Connect()
//connect.exportDb('DICTINARY_BOT_TS', 'dictionary_bot_ts')
//connect.importDb('dictionary_bot_ts', 'DICTINARY_BOT_TS')

//connect.remoteConnect('dictionary_bot_ts')
connect.localConnect('DICTINARY_BOT_TS')
//connect.showAllUsers()

export default User
