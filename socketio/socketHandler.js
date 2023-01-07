const req_component = require("./functions/req_component");
const req_screen = require("./functions/req_screen");
const observe_screen = require("./functions/observe_screen");
const observe_component = require("./functions/observe_component");
const addListeners = (socket) => {
    socket.on('req_component', (msg) => {
        req_component.handle(socket, msg);
    });
    socket.on('req_screen', (msg) => {
        req_screen.handle(socket, msg);
    });
    socket.on('observe_screen', (msg) => {
        observe_screen.handle(socket, msg);
    });
    socket.on('observe_component', (msg) => {
        observe_component.handle(socket, msg);
    });
}

module.exports = {addListeners};
