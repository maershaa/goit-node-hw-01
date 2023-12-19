// ! Используя модуль commander для парсинга аргументов командной строки. Это более популярная альтернатива модулю yargs
// Commander - это популярная библиотека для обработки командной строки в Node.js. 
const { Command } = require('commander');
const contactService = require("./contacts")

const program = new Command();
program
  .option('-a, --action <type>', 'choose action')
  .option('-i, --id <type>', 'user id')
  .option('-n, --name <type>', 'user name')
  .option('-e, --email <type>', 'user email')
  .option('-p, --phone <type>', 'user phone');

program.parse(process.argv);

const argv = program.opts();

// TODO: рефакторить
async function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case 'list':
      const allContacts = await contactService.listContacts();
      console.table(allContacts);
      break;

    case 'get':
      const contactById = await contactService.getContactById(id);
      console.log(contactById);
      break;

    case 'add':
      const newContact = await contactService.addContact({ name, email, phone });
      console.log(newContact);
      break;

    case 'remove':
      const deleteContact = await contactService.removeContact(id);
      console.log(deleteContact);
      break;

    default:
      console.warn('\x1B[31m Unknown action type!');
  }
}

invokeAction(argv);





//! Используя yargs
// yargs - это библиотека для обработки аргументов командной строки в Node.js. 
/* const argv = require('yargs').argv;
const contactService = require("./contacts")

async function invokeAction({ action, id, name, email, phone }) {
    try {
      switch (action) {
        case 'list':
          const allContacts = await contactService.listContacts();
          console.table(allContacts);
          break;
  
        case 'get':
          const contactById = await contactService.getContactById(id);
          console.log(contactById);
          break;
  
        case 'add':
          const newContact = await contactService.addContact({ name, email, phone });
          console.log(newContact);
          break;
  
        case 'remove':
          const deleteContact = await contactService.removeContact(id);
          console.log(deleteContact);
          break;
  
        default:
          console.warn('\x1B[31m Unknown action type!');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  }
  
  invokeAction(argv);
   */