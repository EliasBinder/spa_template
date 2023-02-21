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
        });
        addListeners(socket);
    });
}

module.exports = {init, connectedSockets};
