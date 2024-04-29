module.exports = {
  commandsObj: [
    { command: '/add', description: 'Добавить слово' },
    { command: '/dict', description: 'Просмотреть словарь' },
    { command: '/test', description: 'Протестировать знание переводов' },
    { command: '/stoptest', description: 'Закончить тест' },
    { command: '/del', description: 'Удалить слово' }
    /* { command: '/add_def', description: 'Добавить определение' },
    { command: '/defs', description: 'Просмотреть список определений' },
    { command: '/del_def', description: 'Удалить определение' } */
  ],

  buttons: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: 'Мой словарь', callback_data: 'dict' }],
        [
          { text: 'Добавить слово', callback_data: 'add' },
          { text: 'Удалить слово', callback_data: 'delete' }
        ],
        [{ text: 'Пройти тест', callback_data: 'test' }]
      ]
    })
  },

  buttonsAfterAdd: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: 'Добавить еще', callback_data: 'add' }],
        [{ text: 'Мой словарь', callback_data: 'dict' }],
        [{ text: 'Пройти тест', callback_data: 'test' }]
      ]
    })
  },

  buttonsAfterTest: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: 'Мой словарь', callback_data: 'dict' }],
        [{ text: 'Пройти тест еще раз', callback_data: 'test' }]
      ]
    })
  },

  buttonsIsWord: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: 'Изменить перевод этого слова', callback_data: 'change' }],
        [{ text: 'Добавить другое', callback_data: 'add' }],
        [{ text: 'Отменить', callback_data: 'cancelWord' }]
      ]
    })
  },

  buttonsWithoutDict: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: 'Добавить слово', callback_data: 'add' },
          { text: 'Удалить слово', callback_data: 'delete' }
        ],
        [{ text: 'Пройти тест', callback_data: 'test' }]
      ]
    })
  },

  buttonsWithoutDictFunc(type: string, wordsIndex: number) {
    return {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [
            { text: 'Добавить слово', callback_data: 'add' },
            { text: 'Удалить слово', callback_data: 'delete' }
          ],
          [{ text: 'Пройти тест', callback_data: 'test' }],
          [
            {
              text: 'Просмотреть следующие 50 слов',
              callback_data:
                (type == 'default'
                  ? 'dictMore'
                  : type == 'eng'
                  ? 'engMore'
                  : 'rusMore') + ` ${wordsIndex}`
            }
          ]
        ]
      })
    }
  },

  buttonsDefWithout: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: 'Добавить определение', callback_data: 'add_def' }],
        [{ text: 'Удалить определение', callback_data: 'delete_def' }]
      ]
    })
  },

  buttonsDef1(wordsIndex: number) {
    return {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: 'Добавить определение', callback_data: 'add_def' }],
          [{ text: 'Удалить определение', callback_data: 'delete_def' }],
          [{ text: 'Просмотреть определения', callback_data: 'defs' }]
        ]
      })
    }
  },

  buttonsDef(wordsIndex: number) {
    return {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: 'Добавить определение', callback_data: 'add_def' }],
          [{ text: 'Удалить определение', callback_data: 'delete_def' }],
          [
            {
              text: 'Просмотреть следующие 20 определений',
              callback_data: 'defsMore' + ` ${wordsIndex}`
            }
          ]
        ]
      })
    }
  },

  buttonsIsDef: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          {
            text: 'Изменить определение этого слова',
            callback_data: 'change_def'
          }
        ],
        [{ text: 'Добавить другое', callback_data: 'add_def' }],
        [{ text: 'Отменить', callback_data: 'cancel_def' }]
      ]
    })
  },

  buttonsDefAfterAdd: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: 'Добавить еще', callback_data: 'add_def' }],
        [{ text: 'Мой список определений', callback_data: 'defs' }]
      ]
    })
  },

  addExampleButton: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: 'Добавить пример слова', callback_data: 'add_example' }]
      ]
    })
  },

  start_text: `
  У вас есть свой словарь!
  Пополняйте его новыми словами и проходите тесты для проверки знания этих слов. 
  Используйте следующие команды для управления ботом:
   
  /dict - просмотр словаря
  /add - добавить слово
  /del - удалить слово
  /eng - просмотр только самих слов
  /rus - просмотр только переводов слов
  /test - для проверки знания слов
  /stoptest - для завершения теста и получения его результатов
  /testrus - для проверки знания переводов слов
  /help - для просмотра списка команд`,

  help_text: `
  Используйте следующие команды для управления ботом:
   
  /dict - просмотр словаря
  /add - добавить слово
  /del - удалить слово
  /eng - просмотр только самих слов
  /rus - просмотр только переводов слов
  /test - для проверки знания слов
  /stoptest - для завершения теста и получения его результатов
  /testrus - для проверки знания переводов слов`,

  common_error: 'Произошла ошибка:(',

  success_save: `
  Слово успешно сохранено!
  Используйте команду /dict для просмотра сохраненных слов`,

  enterEngWord: `Введите слово или фразу на английском языке`,

  enterTranslate: `Введите перевод. Чтобы добавить несколько переводов для одного слова, вводите его через слеш(/). примеры:
  
  перевод
  перевод/второй перевод/еще один перевод`,

  del_text: `Введите номера слов через пробел, которые хотите удалить, или группы номеров слов(группы задаются через дефис '-'), в следующем виде:
  
    5-7 1
  
  (в приведенном примере удалятся слова со следующими номерами: 5, 6, 7, 1)`,

  is_word_text:
    'В вашем словаре уже есть такое слово. Вы хотите ввести другое?',

  cancel_word: 'Добавление слова отменено',

  success_delete: 'Удаление произведено успешно!',

  unsuccess_delete:
    'Ни одно слово не было удалено. Возможно введенные вами индексы не относятся ни к одному слову.',

  test_text: `Вы начали проверку знаний слов из вашего словаря. Я буду отправлять вам слова, а вам нужно будет писать переводы этих слов. До того момента, пока вы не напишете одно слово правильно дважды подряд(в разных тестах), оно не будет помечено как проверенное(дважды правильно проверенные пары слов помечаются галочкой ✅, единожды - белым кругом ⚪️ при просмотре словаря). 
Для лучшего запоминания слов дважды правильные слова через время будут обратно помечены как не проверенные(после первой проверки - через день, после второй - через неделю, после третьей - через две недели, после этого прогресс изучения слова перестанет обнуляться)
Чтобы закончить тест, введите команду /stoptest.`,

  testWord(word: string, example: string): string {
    return `Переведите следующее слово:
      
${word}
${example != '' ? 'Пример: ' + example : ''}`
  },

  test_positive_reaction: `Вы ответили правильно!✅`,

  testNegativeReaction(correct_answer: string) {
    return `Ваш ответ оказался неправильным.❌
Правильный ответ: ${correct_answer}`
  },

  testResults(answered: number, correct: number, fullCorrect: number) {
    return `Ваш тест окончен!
    Результаты теста:
Проверено слов: ${answered}
Отвечено правильно⚪️: ${correct}
Отвечено неправильно❌: ${answered - correct}
Проверены дважды правильно✅: ${fullCorrect}`
  },

  test_all_checked: 'Все слова проверены или ваш словарь пуст.',

  test_end: 'Ваш тест окончен!',

  addExampleText: (word: string) => {
    return `Введите предложение с примером использования слова "${word}"`
  },

  example_added_text: 'Пример добавлен!',

  enterDefWord: 'Введите слово, определение которого хотите сохранить',

  enterDefinition: 'Введите определение этого слова',

  success_save_def: `
  Определение успешно сохранено!
  Используйте команду /defs для просмотра сохраненных определений`,

  del_def_text: `Введите номера определений через пробел, которые хотите удалить, или группы номеров определений(группы задаются через дефис '-'), в следующем виде:
  
  3 5-7 1

(в приведенном примере удалятся определения со следующими номерами: 3, 5, 6, 7, 1)`,

  unsuccess_def_delete:
    'Ни одно определение не было удалено. Возможно введенные вами индексы не относятся ни к одному определению.'
}
