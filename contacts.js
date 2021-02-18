import path from 'path';

import { getJsonData, rewriteJsonData } from './lib/json-api.js';
// import * as fs from 'fs/promises'
// import { handleError } from '../lib/handlerror.js';
// import { isAccessible } from '../lib/accessible.js'

// import createDirname from './lib/dirname.js'
// const { __dirname } = createDirname(import.meta.url)


// export const contactsPath = path.relative(__dirname,'/db/contacts.json');
// export const contactsPath = path.relative('/db/contacts.json');
export const contactsPath = './db/contacts.json';



// TODO: задокументировать каждую функцию
export async function listContacts() {
    const contactsData = await getJsonData(contactsPath);
    const contactList = contactsData.map(({ id, name, email, phone }) => ({ name, email, phone }));
    console.table(contactList);  
}

export async function getContactById(contactId) {
    if (!contactId) return;
    const FAIL_MESSAGE = `contact with id:${contactId} not finded!`;

    const contactsData = await getJsonData(contactsPath);
    const singleContact = contactsData.find(({id}) => id === contactId);
    
    console.table((!singleContact) ? FAIL_MESSAGE : singleContact);
}

export async function removeContact(contactId) {
    if (!contactId) return;
    const FAIL_MESSAGE = `DELETE FAILED! Contact with id:${contactId} not finded!`;
    const SUCCESS_MESSAGE = `contact with id:${contactId} is deleted`;
    const EMPTY_LIST_MESSAGE = ` Contact List is EMPTY!`;

    const contactsData = await getJsonData(contactsPath);
    const filteredContactsData = contactsData.filter(({ id }) => id !== contactId);
    console.table(filteredContactsData);
    if (contactsData.length === filteredContactsData.length) {
        console.log(FAIL_MESSAGE);
        return;
    }
    const result = await rewriteJsonData(contactsPath, filteredContactsData);
    if (result) console.log(SUCCESS_MESSAGE);
    if (filteredContactsData.length === 0) console.log(EMPTY_LIST_MESSAGE);
}