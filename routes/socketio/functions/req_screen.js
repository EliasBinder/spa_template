const renderer = require("../../../util/renderer");
const cacheMgr = require("../../../util/cacheMgr");
const {checkForParams} = require("../util");
const handle = (socket, msg) => {
    if (!checkForParams(msg, ['screen', 'languages', 'lastModified', 'reqId']))
        return;

    let lastModified = cacheMgr.getLastModified('s#' + msg.screen);
    if (lastModified === msg.lastModified) {
        socket.emit('resp', {
            reqId: msg.reqId,
            notModified: true
        });
        return;
    }
    const html = renderer.getScreenHtml(msg.languages, msg.screen);
    const js = renderer.getScreenJs(msg.languages, msg.screen);
    lastModified = cacheMgr.getLastModified('s#' + msg.screen);
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
