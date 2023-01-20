const renderer = require("../../../util/renderer");
const cacheMgr = require("../../../util/cacheMgr");
const {checkForParams} = require("../util");
const handle = (socket, msg) => {
    if (!checkForParams(msg, ['type', 'name', 'languages', 'lastModified', 'reqId']))
        return;

    const type = msg.type;

    let lastModified = cacheMgr.getLastModified(type[0] + '#' + msg.name);
    if (lastModified === msg.lastModified) { //TODO add check if language file has been modified
        socket.emit('resp', {
            reqId: msg.reqId,
            notModified: true
        });
        return;
    }
    const html = renderer.getHtml(msg.languages, type, msg.name);
    const js = renderer.getJs(msg.languages, type, msg.name);
    lastModified = cacheMgr.getLastModified(type[0] + '#' + msg.name);
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
