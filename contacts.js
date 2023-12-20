//const { customAlphabet } = require('nanoid');//Библиотека Nano ID в версии 5 работает только с ESM проектами, но 3 версия еще поддерживается и работает с СommonJS. Вместо функции nanoid() она предоставляет метод customAlphabet() для создания пользовательской функции генерации идентификаторов.
const crypto = require("node:crypto");//встроенный пакет вместо nanoid

const fs = require("node:fs/promises");
const path = require("node:path");

// если бы нам нужно было прописать подняться на 1 уровень выше в папку, то мы бы писали ".." и выглядело бы вот так :
// const contactsPath = path.join(__dirname, "..", "db", "contacts.json");
const contactsPath = path.join(__dirname,  "db", "contacts.json");

console.log('__dirname', __dirname); // Вывод информации о текущей папке
console.log('__filename', __filename); // Вывод информации о текущем файле


// customAlphabet() создает функцию nanoid, которая будет генерировать случайные идентификаторы длиной 10 символов, используя алфавит '1234567890abcdef'.
// const nanoid = customAlphabet('1234567890abcdef', 10);





//JSON.stringify преобразует объект contacts в строку JSON с отступами (2 пробела), делая данные более читаемыми при записи в файл.
const updateContacts = contacts => fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));


async function listContacts() {
  const data = await fs.readFile(contactsPath, {encoding: "utf-8"}); //или можно без encoding таким образом const data = await fs.readFile(contactsPath, 'utf-8');
  return JSON.parse(data);
}


async function getContactById(contactId) {
    // ...твой код. Возвращает объект контакта с таким id. Возвращает null, если объект с таким id не найден.

    const contacts = await listContacts();
    const result = contacts.find(item => item.id === contactId);
    return result || null;
  }
  
  async function removeContact(contactId) {
    // ...твой код. Возвращает объект удаленного контакта. Возвращает null, если объект с таким id не найден.
    const contacts = await listContacts();
    const index = contacts.findIndex(item => item.id === contactId);
    if (index === -1) {
        return null;
    }


    const [result] = contacts.splice(index, 1);//мутируем обьект contacts так как splice  изменяет исходный массив

//если не хотим мутировать обьект contacts то используем slice, который можно использовать для создания обновленной копии массива таким образом:
// const updatedContacts = contacts.slice(0, index).concat(contacts.slice(index + 1));
// const removedContact = contacts[index];

    await updateContacts(contacts);
    return result;
  }
  
  async function addContact({name, email, phone}) {
    // ...твой код. Возвращает объект добавленного контакта. 
    const contacts = await listContacts();    
    const newContact = {
        // id: nanoid(),
        id: crypto.randomUUID(), //вместо nanoid используем встроенный в ноду модуль
        name, email, phone
      };
      contacts.push(newContact);
      await updateContacts(contacts);
      return newContact;
}

// ! Не предусмотрено домашней работой
async function updateContact(id, updatedContact) {
  const contacts = await listContacts();
  const index = contacts.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }

  const originalContact = contacts[index];  // Получаем оригинальный контакт из списка

  // Создаем новый контакт, объединяя оригинальный контакт с обновленными данными
  const newContact = { ...originalContact, ...updatedContact };

  contacts[index] = newContact;  // Заменяем оригинальный контакт на новый контакт в массиве контактов

  await updateContacts(contacts);
  return newContact;
}


  module.exports ={
    listContacts, getContactById, removeContact, addContact, updateContact
  }




//   # Получаем и выводим весь список контактов в виде таблицы (console.table)
// node index.js --action list

// # Получаем контакт по id - выводим в консоль объект контакта или null, если контакта с таким id не существует.
// node index.js --action get --id 05olLMgyVQdWRwgKfg5J6

// # Добавляем контакт и выводим в консоль созданный контакт
// node index.js --action add --name Mango --email mango@gmail.com --phone 322-22-22

// # Удаляем контакт и выводим в консоль удаленный контакт или null, если контакта с таким id не существует.
// node index.js --action remove --id qdggE76Jtbfd9eWJHrssH


// # Обновляем существующий контакт и выводим его в консоль. 
// !ЭТО ИДЕНТИЧНЫЕ ЗАПИСИ  ПРОСТО ОДНА КОРОТКАЯ А ДРУГАЯ ДЛИННАЯ:
// node index.js --action=update --id=rsKkOQUi80UsgVPCcLZZW --name=Marishka --email=Marishka@gmail.com --phone=0937635489
// node index.js -a update -i rsKkOQUi80UsgVPCcLZZW -n Marishka -e Marishka@gmail.com -p 0937635489
