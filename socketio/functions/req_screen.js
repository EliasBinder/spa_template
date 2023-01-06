const renderer = require("../../util/renderer");
const cacheMgr = require("../../util/cacheMgr");
const handle = (socket, msg) => {
    let lastModified = cacheMgr.getLastModified('s#' + msg.screen);
    if (lastModified === msg.lastModified) {
        socket.emit('resp', {
            reqId: msg.reqId,
            notModified: true
        });
        return;
    }
    const html = renderer.getScreenHtml(msg.language, msg.screen);
    const js = renderer.getScreenJs(msg.language, msg.screen);
    lastModified = cacheMgr.getLastModified('s#' + msg.screen);
    socket.emit('resp', {
        reqId: msg.reqId,
        html: html,
        js: js,
        lastModified: lastModified
    })
}

module.exports = {handle};
