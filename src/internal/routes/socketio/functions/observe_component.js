const {checkForParams} = require("../util");
const {IntercomConnection} = require("../../../util/serverSideComponents/intercomConnection");
const componentStore = require("../../../util/serverSideComponents/componentStore");
const intercomConnection = require("../../../util/serverSideComponents/intercomConnection");

const STORAGE = {}

const handle = (socket, msg) => {
    if (!checkForParams(msg, ['type', 'name', 'action']))
        return;
    const type = msg.type;
    if (msg.action === 'add') {
        if (!STORAGE[type[0] + '#' + msg.name])
            STORAGE[type[0] + '#' + msg.name] = new Map();
        const map = STORAGE[type[0] + '#' + msg.name];
        if (map.has(socket))
            map.set(socket, map.get(socket) + 1);
        else
            map.set(socket, 1);
        const intercomConnection = new IntercomConnection(socket, type, msg.name);
        socket.emit('resp', {
            reqId: msg.reqId,
            id: intercomConnection.getId()
        })
    } else if (msg.action === 'remove') {
        if (STORAGE[type[0] + '#' + msg.name] === undefined)
            return;
        const map = STORAGE[type[0] + '#' + msg.name];
        if (map.has(socket)) {
            if (map.get(socket) === 1)
                map.delete(socket);
            else
                map.set(socket, map.get(socket) - 1);
        }
        if (msg.id)
            componentStore.getComponent(type, msg.name)?.getIntercom().removeConnection(intercomConnection.getConnection(socket, msg.id));
    }
}

const getStorage = () => {
    return STORAGE;
}

module.exports = {handle, getStorage};