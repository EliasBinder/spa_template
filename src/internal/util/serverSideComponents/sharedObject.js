class SharedObject {

    intercom = null;

    store = new Map();

    constructor(intercom) {
        this.intercom = intercom;
    }

    set(key, value) {
        this.store.set(key, value);
    }

    get(key) {
        return this.store.get(key);
    }
}

module.exports = SharedObject;