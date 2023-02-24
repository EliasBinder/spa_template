const {addListeners} = require("./socketHandler");
const componentStore = require("../../util/serverSideComponents/componentStore");
const intercomConnection = require("../../util/serverSideComponents/intercomConnection");
const connectedSockets = [];

const init = (io) => {
    io.on('connection', (socket) => {
        connectedSockets.push(socket);
        socket.on('disconnect', () => {
            connectedSockets.splice(connectedSockets.indexOf(socket), 1);
            //remove connection from all server-side-components
            if (socket.intercomIds)
                socket.intercomIds.forEach(id => {
                    const connection = intercomConnection.getConnection(socket, id);
                    if (connection)
                        connection.destroy();
                });
            //remove component from observed components
            const storage = require("./functions/observe_component").getStorage();
            Object.keys(storage).forEach(key => {
                const map = storage[key];
                if (map.has(socket)) {
                    map.delete(socket);
                }
            });
        });
        addListeners(socket);
    });
}

module.exports = {init, connectedSockets};
