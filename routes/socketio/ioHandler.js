const {addListeners} = require("./socketHandler");
const connectedSockets = [];

const init = (io) => {
    io.on('connection', (socket) => {
        connectedSockets.push(socket);
        socket.on('disconnect', () => {
            connectedSockets.splice(connectedSockets.indexOf(socket), 1);
        });
        addListeners(socket);
    });
}

module.exports = {init, connectedSockets};
