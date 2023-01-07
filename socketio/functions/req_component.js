const renderer = require("../../util/renderer");
const cacheMgr = require("../../util/cacheMgr");
const {checkForParams} = require("../util");
const handle = (socket, msg) => {
    if (!checkForParams(msg, ['component', 'languages', 'lastModified', 'reqId']))
        return;

    let lastModified = cacheMgr.getLastModified('c#' + msg.component);
    if (lastModified === msg.lastModified) {
        socket.emit('resp', {
            reqId: msg.reqId,
            notModified: true
        });
        return;
    }
    const html = renderer.getComponentHtml(msg.languages, msg.component);
    const js = renderer.getComponentJs(msg.languages, msg.component);
    lastModified = cacheMgr.getLastModified('c#' + msg.component);
    if (lastModified === -1){
        socket.emit('resp', {
            reqId: msg.reqId,
            notFound: true
        });
        return;
    }
    socket.emit('resp', {
        reqId: msg.reqId,
        html: html,
        js: js,
        lastModified: lastModified
    })
}

module.exports = {handle};
