const {checkForParams} = require("../util");

const STORAGE = {}

const handle = (socket, msg) => {
    if (!checkForParams(msg, ['type', 'name', 'action']))
        return;
    const type = msg.type;
    if (msg.action === 'add') {
        if (!STORAGE[type[0] + '#' + msg.name])
            STORAGE[type[0] + '#' + msg.name] = [];
        STORAGE[type[0] + '#' + msg.name].push(socket)
    } else if (msg.action === 'remove') {
        if (STORAGE[type[0] + '#' + msg.name] === undefined)
            return;
        STORAGE[type[0] + '#' + msg.name] = STORAGE[type[0] + '#' + msg.name].filter(s => s !== socket) //TODO shorten with slice
        if (STORAGE[type[0] + '#' + msg.name].length === 0)
            delete STORAGE[type[0] + '#' + msg.name];
    }
}

const getStorage = () => {
    return STORAGE;
}

module.exports = {handle, getStorage};