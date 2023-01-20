const cacheMgr = require("../../util/cacheMgr");
const observe_component = require("./functions/observe_component");
const onDeleted = (type, object) => {
    console.log("Deleted " + type.toLowerCase() + " " + object);
    cacheMgr.CACHE.delete(type[0] + '#' + object);
    if (observe_component.getStorage()[type[0] + '#' + object]) {
        observe_component.getStorage()[type[0] + '#' + object].forEach(socket => {
            socket.emit('update_component', {
                action: 'delete',
                name: object,
                type
            });
        });
    }
}

const onModified = (type, object) => {
    console.log("Changed " + type.toLowerCase() + " " + object);
    cacheMgr.CACHE.delete(type[0] + '#' + object);
    cacheMgr.compileToCache(type, object);
    if (observe_component.getStorage()[type[0] + '#' + object]) {
        observe_component.getStorage()[type[0] + '#' + object].forEach(socket => {
            socket.emit('update_component', {
                action: 'modify',
                name: object,
                type,
                html: cacheMgr.CACHE.get(type[0] + '#' + object).html,
                js: cacheMgr.CACHE.get(type[0] + '#' + object).js
            });
        });
    }
}

module.exports = {
    onDeleted,
    onModified
}