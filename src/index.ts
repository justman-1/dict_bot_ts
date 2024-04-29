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

      case '/defs':
        Controllers.definitions(msg)
        break

      case '/add_def':
        Controllers.add_def(msg)
        break

      case '/del_def':
        Controllers.del_def(msg)
        break

      default:
        Controllers.default(msg)
    }
  } catch (err) {
    Controllers.error(err)
  }
})

bot.on('callback_query', async (query: any) => {
  const queryParts: string[] = query.data.split(' ')
  switch (queryParts[0]) {
    case 'dict':
      await Controllers.dict(query.message)
      break

    case 'dictMore':
      await Controllers.dictMore(query.message, queryParts[1])
      break

    case 'engMore':
      await Controllers.engMore(query.message, queryParts[1])
      break

    case 'rusMore':
      await Controllers.rusMore(query.message, queryParts[1])
      break

    case 'add':
      await Controllers.add(query.message)
      break

    case 'change':
      await Controllers.change(query.message)
      break

    case 'cancelWord':
      await Controllers.cancelWordAdd(query.message)
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

    case 'defs':
      await Controllers.definitions(query.message)
      break

    case 'add_def':
      await Controllers.add_def(query.message)
      break

    case 'delete_def':
      Controllers.del_def(query.message)
      break
  }
  bot.answerCallbackQuery(query.id)
})
