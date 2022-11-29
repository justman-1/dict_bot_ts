import { UserObj } from "../types/index"

let mongoose = require("mongoose")
const Schema = mongoose.Schema
let mongoPath = (dbName: string) => {
  return `mongodb+srv://user1:user@example.7j3yd.mongodb.net/${dbName}?retryWrites=true&w=majority`
}

const userScheme = new Schema({
  id: Number,
  dict: [
    {
      words: [String, String],
      tested: Number,
    },
  ],
})

const User = mongoose.model("User", userScheme)

class Connect {
  constructor() {
    this.remoteConnect = this.remoteConnect.bind(this)
    this.localConnect = this.localConnect.bind(this)
  }

  async remoteConnect(dbName: string) {
    await mongoose
      .connect(mongoPath(dbName), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((MongoClient: any) => {
        try {
          console.log("Connected to mongoDB!")
        } finally {
        }
      })
  }

  async localConnect(dbName: string) {
    await mongoose.connect(`mongodb://localhost:27017/${dbName}`, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
  }

  async connectToMongoDb(dbName: string) {
    this.remoteConnect(dbName)
    //this.localConnect(dbName)
  }

  async importDb(from: string, to: string) {
    await this.remoteConnect(from)
    let data = await User.find({})
    await mongoose.connection.close()
    await this.localConnect(to)
    data = data.map((user: UserObj) => {
      const user2 = {
        id: user.id,
        dict: user.dict,
      }
      return user2
    })
    console.log(data)
    User.create(data)
    console.log("ok")
  }
}

const connect = new Connect()
//connect.remoteConnect("dictionary_bot")
connect.localConnect("DICTINARY_BOT_TS")

export default User
