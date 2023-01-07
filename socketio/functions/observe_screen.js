const {checkForParams} = require("../util");

const STORAGE = {}

const handle = (socket, msg) => {
    if (!checkForParams(msg, ['screen', 'action']))
        return;
    if (msg.action === 'add') {
        if (!STORAGE[msg.screen])
            STORAGE[msg.screen] = [];
        STORAGE[msg.screen].push(socket)
    } else if (msg.action === 'remove') {
        if (STORAGE[msg.screen] === undefined)
            return;
        STORAGE[msg.screen] = STORAGE[msg.screen].filter(s => s !== socket)
        if (STORAGE[msg.screen].length === 0)
            delete STORAGE[msg.screen];
    }
}

const getStorage = () => {
    return STORAGE;
}

module.exports = {handle, getStorage};