import path from 'path';

import { getJsonData, rewriteJsonData } from './lib/json-api.js';
// import * as fs from 'fs/promises'
// import { handleError } from '../lib/handlerror.js';
// import { isAccessible } from '../lib/accessible.js'

const msgs = {
    EMPTY_CONTACT_LIST: "Contact list is empty",
    ID_NOT_FINDED: contactId => `Contact with id:${contactId} not finded!`,

    DELETE_FAIL: `DELETE FAILED!`,
    DELETE_SUCCESS: contactId => `contact with id:${contactId} is deleted`,

    ADDING_SUCCESS: contactName => `The ${contactName} was added to contact list.`,
    ADDING_FAIL: `Contact adding is FAIL!`,
};

const contactsPath = path.resolve('./db/contacts.json');

// TODO: задокументировать каждую функцию
export async function listContacts() {
    const contactsData = await getJsonData(contactsPath);
    if (contactsData?.length === 0) {
        console.log(msgs.EMPTY_CONTACT_LIST);
        return;
    } 
    const contactList = contactsData.map(({ id, name, email, phone }) => ({ name, email, phone }));
    console.table(contactList);  
}

export async function getContactById(contactId) {
    if (!contactId) return;

    const contactsData = await getJsonData(contactsPath);
    const singleContact = contactsData.find(({id}) => id === contactId);
    
    console.table((!singleContact) ? msgs.ID_NOT_FINDED(contactId) : singleContact);
}

export async function removeContact(contactId) {
    if (!contactId) return;

    const contactsData = await getJsonData(contactsPath);
    if (contactsData?.length === 0) {
        console.log(msgs.DELETE_FAIL);
        console.log(msgs.EMPTY_CONTACT_LIST);
        return;
    }
    
    const filteredContactsData = contactsData.filter(({ id }) => id !== contactId);
    
    if (contactsData.length === filteredContactsData.length) {
        console.log(msgs.DELETE_FAIL);
        console.log(msgs.ID_NOT_FINDED(contactId));
        return;
    }

    const result = await rewriteJsonData(contactsPath, filteredContactsData);
    if (result) console.log(msgs.DELETE_SUCCESS(contactId));
    if (filteredContactsData.length === 0) console.log(msgs.EMPTY_CONTACT_LIST);
}

export async function addContact(name, email, phone) {
    if (!name) return;

    const contactList = await getJsonData(contactsPath);
    if (contactList.constructor !== Array) return;

    const id = (contactList.length === 0)
        ? 1
        : contactList[contactList.length - 1]?.id + 1;
    
    const newContactObj = { id, name, email, phone };
    
    console.log(
        (rewriteJsonData(
            contactsPath,
            [...contactList, newContactObj]
        )
        )
            ? msgs.ADDING_SUCCESS(newContactObj.name)
            : msgs.ADDING_FAIL
    );
}