const cacheMgr = require("../util/cacheMgr");
const observe_screen = require("./functions/observe_screen");
const observe_component = require("./functions/observe_component");
const onDeleted = (type, object) => {
    console.log("Deleted " +(type==='s'?'screen':'component') + " " + object);
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
                console.log("Deleted component: " + object);
                observe_component.getStorage()[object].forEach(socket => {
                    socket.emit('update_component', {
                        action: 'delete',
                        component: object
                    });
                    console.log("Sent update to socket " + socket.id);
                });
            }
            break;
    }
}

module.exports = {
    onDeleted
}