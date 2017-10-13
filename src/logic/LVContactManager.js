/*
 * Project: Venus
 * File: src/logic/LVContactManager.js
 * Author: Charles liu
 * @flow
 */

import LVPersistent from './LVPersistent';
const ContactsKey :string = '@Venus:ContactsKey';

class LVContactManager {
    contacts: Array<Object>;

    constructor() {
        this.contacts = [];
    }

    getContacts() {
        return [].concat(this.contacts).reverse();
    }

    async loadLocalContacts() {
        const contacts = await LVPersistent.getObject(ContactsKey);
        if(contacts) {
            this.contacts = contacts;
        }
    }

    add(contact: Object) {
        this.contacts.push(contact);
    }

    containsContact(contactName: string) {
        const index = this.contacts.
    }

    saveToDisk() {
        LVPersistent.setObject(ContactsKey, this.contacts);
    }
}

const contactManager = new LVContactManager;

export default contactManager;