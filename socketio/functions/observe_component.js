const {checkForParams} = require("../util");

const STORAGE = {}

const handle = (socket, msg) => {
    if (!checkForParams(msg, ['component', 'action']))
        return;
    if (msg.action === 'add') {
        if (!STORAGE[msg.component])
            STORAGE[msg.component] = [];
        STORAGE[msg.component].push(socket)
    } else if (msg.action === 'remove') {
        if (STORAGE[msg.component] === undefined)
            return;
        STORAGE[msg.component] = STORAGE[msg.component].filter(s => s !== socket)
        if (STORAGE[msg.component].length === 0)
            delete STORAGE[msg.component];
    }
}

const getStorage = () => {
    return STORAGE;
}

module.exports = {handle, getStorage};