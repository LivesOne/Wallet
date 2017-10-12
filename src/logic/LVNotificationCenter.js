/*
 * Project: Venus
 * File: src/logic/LVNotificationCenter.js
 * @flow
 */
"use strict";

export default class LVNotificationCenter {
    constructor() {}
    
    static postNotification(name: string, object: ?Object) {
        _evaluateNotification(name, object);
    }

    static addObserver(observer: Object, name: string, response: Function ) {
        _addObserver(observer, name, response);
    }
    
    static removeObserver(observer: Object, name: ?string) {
        _removeObserver(observer, name);
    }
    
    static removeObservers(observer: Object) {
        _removeObserver(observer, null);
    }
}

/// Private

/*
{
    observer: {
        name1: response1,
        name2: response2,
        ...
    }
}
*/
const _observer_map = new Map();

function _print_observer_map() {
    [..._observer_map].map(([k, v]) => {
        console.log(JSON.stringify([...v]));
    });
}

function _isEmptyString(str: string) {
  return (str === null || str === undefined || str === '');
}

function _addObserver(observer: Object, name: string, response: Function) {
    if (!response || !observer || _isEmptyString(name)) {
        return;
    }

    let submap = _observer_map.get(observer);
    if (!submap) {
        submap = new Map();
        _observer_map.set(observer, submap);
    }

    submap.set(name, response);
}

function _removeObserver(observer: Object, name: ?string) {
    if (!observer) {
        return;
    }

    if (name === null) {
        _observer_map.delete(observer);
    } else {
        const submap = _observer_map.get(observer);
        if (submap) {
            submap.delete(name);
        }
    }
}

function _evaluateNotification(name: string, object: ?Object) {
    if (_isEmptyString(name)) {
        return;
    }

    [..._observer_map].map(([k, v]) => {
        const response = v.get(name);
        if (response) {
            response(object);
        }
    });
}
