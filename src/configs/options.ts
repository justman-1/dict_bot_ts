module.exports = {
    commandsObj: [
      { command: "/help", description: "Просмотреть команды" },
      { command: "/dict", description: "Просмотреть словарь" },
      { command: "/add", description: "Добавить слово" },
      { command: "/del", description: "Удалить слово" },
      { command: "/eng", description: "Просмотреть только английские слова" },
      { command: "/rus", description: "Просмотреть только переводы слов" },
    ],
  
    buttons: {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: "Мой словарь", callback_data: "dict" }],
          [
            { text: "Добавить слово", callback_data: "add" },
            { text: "Удалить слово", callback_data: "delete" },
          ],
        ],
      }),
    },
  
    buttonsAfterAdd: {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: "Добавить еще", callback_data: "add" }],
          [{ text: "Мой словарь", callback_data: "dict" }],
        ],
      }),
    },
  
    buttonsIsWord: {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: "Изменить перевод этого слова", callback_data: "change" }],
          [{ text: "Добавить другое", callback_data: "add" }],
          [{ text: "Отменить", callback_data: "cancelWord" }],
        ],
      }),
    },
  
    buttonsWithoutDict: {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [
            { text: "Добавить слово", callback_data: "add" },
            { text: "Удалить слово", callback_data: "delete" },
          ],
        ],
      }),
    },
  
    buttonsWithoutDictFunc(type: string) {
      return {
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [
              { text: "Добавить слово", callback_data: "add" },
              { text: "Удалить слово", callback_data: "delete" },
            ],
            [
              {
                text:
                  "Просмотреть " +
                  (type == "default"
                    ? "словарь полностью"
                    : type == "eng"
                    ? "все английские слова"
                    : "все переводы слов"),
                callback_data:
                  type == "default"
                    ? "dictFull"
                    : type == "eng"
                    ? "engFull"
                    : "rusFull",
              },
            ],
          ],
        }),
      }
    },
  
    start_text: `
  У вас есть свой словарь!
  Используйте следующие команды для управления ботом:
   
  /dict - просмотр своего словаря
  /add - добавить слово
  /del - удалить слово
  /eng - просмотр только английских слов
  /rus - просмотр только русских слов`,
  
    help_text: `
  Используйте следующие команды для управления ботом:
   
  /dict - просмотр своего словаря
  /add - добавить слово
  /del - удалить слово
  /eng - просмотр только английских слов
  /rus - просмотр только русских слов`,
  
    success_save: `
  Слово успешно сохранено!
  Используйте команду /dict для просмотра сохраненных слов`,
  
    enterEngWord: `Введите слово или фразу на английском языке`,
  
    del_text: `Введите номера слов через пробел, которые хотите удалить, или группы номеров слов(группы задаются через дефис '-'), в следующем виде:
  
    3 5-7 1
  
  (в приведенном примере удалятся слова со следующими номерами: 3, 5, 6, 7, 1)`,
  
    is_word_text:
      "В вашем словаре уже есть такое слово. Вы хотите ввести другое?",
  
    success_delete: "Удаление произведено успешно!",
  
    unsuccess_delete:
      "Ни одно слово не было удалено. Возможно, ваш словарь пуст или введенные вами индексы не относятся ни к одному слову.",
  }
  