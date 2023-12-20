const { customAlphabet } = require('nanoid');//Библиотека Nano ID в версии 5 работает только с ESM проектами, но 3 версия еще поддерживается и работает с СommonJS. Вместо функции nanoid() она предоставляет метод customAlphabet() для создания пользовательской функции генерации идентификаторов.
const fs = require("node:fs/promises");
const path = require("node:path");
const contactsPath = path.join(__dirname, "db", "contacts.json");

// TODO: задокументировать каждую функцию

// customAlphabet() создает функцию nanoid, которая будет генерировать случайные идентификаторы длиной 10 символов, используя алфавит '1234567890abcdef'.
const nanoid = customAlphabet('1234567890abcdef', 10);



//JSON.stringify преобразует объект contacts в строку JSON с отступами (2 пробела), делая данные более читаемыми при записи в файл.
const updateContacts = contacts => fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));


async function listContacts() {
  const data = await fs.readFile(contactsPath, 'utf-8');
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
    const [result] = contacts.splice(index, 1);
    await updateContacts(contacts);
    return result;
  }
  
  async function addContact({name, email, phone}) {
    // ...твой код. Возвращает объект добавленного контакта. 
    const contacts = await listContacts();    
    const newContact = {
        id: nanoid(),
        name, email, phone
      };
      contacts.push(newContact);
      await updateContacts(contacts);
      return newContact;
}

  module.exports ={
    listContacts, getContactById, removeContact, addContact
  }




//   # Получаем и выводим весь список контактов в виде таблицы (console.table)
// node index.js --action list

// # Получаем контакт по id - выводим в консоль объект контакта или null, если контакта с таким id не существует.
// node index.js --action get --id 05olLMgyVQdWRwgKfg5J6

// # Добавляем контакт и выводим в консоль созданный контакт
// node index.js --action add --name Mango --email mango@gmail.com --phone 322-22-22

// # Удаляем контакт и выводим в консоль удаленный контакт или null, если контакта с таким id не существует.
// node index.js --action remove --id qdggE76Jtbfd9eWJHrssH