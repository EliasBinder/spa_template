const req_component = require("./functions/req_component");
const req_screen = require("./functions/req_screen");
const addListeners = (socket) => {
    socket.on('req_component', (msg) => {
        req_component.handle(socket, msg);
    });
    socket.on('req_screen', (msg) => {
        req_screen.handle(socket, msg);
    });
}

module.exports = {addListeners};
