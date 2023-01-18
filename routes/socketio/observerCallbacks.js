const cacheMgr = require("../../util/cacheMgr");
const observe_screen = require("./functions/observe_screen");
const observe_component = require("./functions/observe_component");
const onDeleted = (type, object) => {
    console.log("Deleted " + (type==='s'?'screen':'component') + " " + object);
    cacheMgr.CACHE.delete(type + '#' + object);
    switch (type) {
        case 's':
            observe_screen.getStorage()[object].forEach(socket => {
                socket.emit('update_screen', {
                    action: 'delete',
                    screen: object
                });
            });
            break;
        case 'c':
            if (observe_component.getStorage()[object]) {
                observe_component.getStorage()[object].forEach(socket => {
                    socket.emit('update_component', {
                        action: 'delete',
                        component: object
                    });
                });
            }
            break;
    }
}

const onModified = (type, object) => {
    console.log("Deleted " + (type==='s'?'screen':'component') + " " + object);
    cacheMgr.CACHE.delete(type + '#' + object);
    switch (type) {
        case 's':
            cacheMgr.compileScreenToCache(object);
            if (observe_screen.getStorage()[object]) {
                observe_screen.getStorage()[object].forEach(socket => {
                    socket.emit('update_screen', {
                        action: 'modify',
                        screen: object,
                        html: cacheMgr.CACHE.get('s#' + object).html,
                        js: cacheMgr.CACHE.get('s#' + object).js
                    });
                });
            }
            break;
        case 'c':
            cacheMgr.compileComponentToCache(object);
            if (observe_component.getStorage()[object]) {
                observe_component.getStorage()[object].forEach(socket => {
                    socket.emit('update_component', {
                        action: 'modify',
                        component: object,
                        html: cacheMgr.CACHE.get('c#' + object).html,
                        js: cacheMgr.CACHE.get('c#' + object).js
                    });
                });
            }
            break;
    }
}

module.exports = {
    onDeleted,
    onModified
}