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

      case '/testrus':
        Controllers.test_rus(msg)
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

bot.on('callback_query', async (query: any) => {
  switch (query.data) {
    case 'dict':
      await Controllers.dict(query.message)
      break

    case 'dictFull':
      await Controllers.dictFull(query.message)
      break

    case 'engFull':
      await Controllers.engFull(query.message)
      break

    case 'rusFull':
      await Controllers.rusFull(query.message)
      break

    case 'add':
      await Controllers.add(query.message)
      break

    case 'change':
      await Controllers.change(query.message)
      break

    case 'cancelWord':
      await Controllers.help(query.message)
      break

    case 'delete':
      await Controllers.del(query.message)
      break

    case 'test':
      await Controllers.test(query.message)
      break

    case 'add_example':
      await Controllers.add_example(query.message)
      break
  }
  bot.answerCallbackQuery(query.id)
})
