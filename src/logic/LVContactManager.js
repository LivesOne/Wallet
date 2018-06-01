/*
 * Project: Venus
 * File: src/logic/LVContactManager.js
 * Author: Charles liu
 * @flow
 */

import LVPersistent from './LVPersistent';
import { isEmptyString } from '../utils/MXUtils';
const ContactsKey :string = '@Venus:ContactsKey';

class LVContactManager {
    contacts: Array<Object>;

    constructor() {
        this.contacts = [];
    }

    static createContact(name: string, address: string, cellPhone: string, email: string) {
        if(isEmptyString(name)) {
            throw 'name should not be null or empty';
        }
        if(isEmptyString(address)) {
            throw 'address should not be null or empty';
        }

        return {
            name: name,
            address: address,
            cellPhone: cellPhone,
            email: email,
        };
    }

    getContacts() {
        return [].concat(this.contacts).reverse();
    }

    getContactWithName(name: string) : ?Object {
        return this.contacts.find((c) => c.name === name);
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

    remove(contact: Object): boolean {
        const index = this.contacts.findIndex((c)=> {
            return c.name === contact.name;
        });

        if(index === -1) {
            return false;
        }

        //remove contact from memory.
        this.contacts.splice(index,1);
        return true;
    }

    containsContact(contactName: string) {
        const index = this.contacts.findIndex((contact)=> {
            return contact.name === contactName;
        });

        return index !== -1;
    }

    async saveToDisk(): Promise<void> {
        await LVPersistent.setObject(ContactsKey, this.contacts);
    }
}

const instance = new LVContactManager;

export {instance, LVContactManager};