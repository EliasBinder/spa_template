const renderer = require("../../util/renderer");
const handle = (socket, msg) => {
    const html = renderer.getComponentHtml(msg.language, msg.component);
    const js = renderer.getComponentJs(msg.language, msg.component);

    socket.emit('resp', {
        reqId: msg.reqId,
        html: html,
        js: js
    })
}

module.exports = {handle};
