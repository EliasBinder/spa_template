const req_component = require("./functions/req_component");
const observe_component = require("./functions/observe_component");
const addListeners = (socket) => {
    socket.on('req_component', (msg) => {
        req_component.handle(socket, msg);
    });
    socket.on('observe_component', (msg) => {
        observe_component.handle(socket, msg);
    });
}

module.exports = {addListeners};
