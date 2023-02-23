const cacheMgr = require("../../util/cacheMgr");
const observe_component = require("./functions/observe_component");
const componentCompiler = require("../../util/componentCompiler");
const onDeleted = (type, object) => {
    cacheMgr.CACHE.delete(type[0] + '#' + object);
    const map = observe_component.getStorage()[type[0] + '#' + object];
    if (map) {
        const processedSockets = [];
        map.forEach((val, socket) => {
            if (processedSockets.includes(socket))
                return;
            socket.emit('update_component', {
                action: 'delete',
                name: object,
                type
            });
            processedSockets.push(socket);
        });
    }
}

const onModified = (type, object) => {
    cacheMgr.CACHE.delete(type[0] + '#' + object);
    componentCompiler.compile(type, object);
    const map = observe_component.getStorage()[type[0] + '#' + object];
    if (map) {
        const processedSockets = [];
        map.forEach((val, socket) => {
            if (processedSockets.includes(socket))
                return;
            socket.emit('update_component', {
                action: 'modify',
                name: object,
                type,
                html: cacheMgr.CACHE.get(type[0] + '#' + object).html,
                js: cacheMgr.CACHE.get(type[0] + '#' + object).js
            });
            processedSockets.push(socket);
        });
    }
}

module.exports = {
    onDeleted,
    onModified
}