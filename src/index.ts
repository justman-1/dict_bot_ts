require('dotenv').config()
import Controllers from './controllers/index'
import bot from './configs/bot'

bot.on('message', async (msg: any) => {
  try {
    switch (msg.text) {
      case '/start':
        Controllers.start(msg)
        break

      case '/help':
        Controllers.help(msg)
        break

      case '/dict':
        Controllers.dict(msg)
        break

      case '/eng':
        Controllers.eng(msg)
        break

      case '/rus':
        Controllers.rus(msg)
        break

      case '/add':
        Controllers.add(msg)
        break

      case '/del':
        Controllers.del(msg)
        break

      case '/test':
        Controllers.test(msg)
        break

      case '/stoptest':
        Controllers.stoptest(msg)
        break

      default:
        Controllers.default(msg)
    }
  } catch (err) {
    Controllers.error(err)
  }
})

bot.on('callback_query', async (msg: any) => {
  switch (msg.data) {
    case 'dict':
      Controllers.dict(msg.message)
      break

    case 'dictFull':
      Controllers.dictFull(msg.message)
      break

    case 'engFull':
      Controllers.engFull(msg.message)
      break

    case 'rusFull':
      Controllers.rusFull(msg.message)
      break

    case 'add':
      Controllers.add(msg.message)
      break

    case 'change':
      Controllers.change(msg.message)
      break

    case 'cancelWord':
      Controllers.help(msg.message)
      break

    case 'delete':
      Controllers.del(msg.message)
      break

    case 'test':
      Controllers.test(msg.message)
      break
  }
})
