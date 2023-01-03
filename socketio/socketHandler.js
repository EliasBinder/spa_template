const req_component = require("./functions/req_component");
const addListeners = (socket) => {
    socket.on('req_component', (msg) => {
        req_component.handle(socket, msg);
    });
}

module.exports = {addListeners};
