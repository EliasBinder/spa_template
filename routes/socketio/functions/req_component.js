const renderer = require("../../../util/renderer");
const cacheMgr = require("../../../util/cacheMgr");
const {checkForParams} = require("../util");
const {parseLanguagesField, lastChanged} = require("../../../util/languageParser");
const fs = require("fs");
const path = require("path");
const handle = (socket, msg) => {
    if (!checkForParams(msg, ['type', 'name', 'languages', 'lastModified', 'reqId']))
        return;

    const type = msg.type;

    //Check component if modified
    let lastModifiedComponent = cacheMgr.getLastModified(type[0] + '#' + msg.name);
    //Check language if modified
    const langToUse = parseLanguagesField(msg.languages);
    const langLastModified = lastChanged(langToUse);
    //Check config if modified
    const configLastModified = fs.statSync(path.join(__dirname, '..', '..', '..', 'app.json')).mtime;
    if (lastModifiedComponent === msg.lastModified && msg.lastModified >= langLastModified && msg.lastModified >= configLastModified) {
        socket.emit('resp', {
            reqId: msg.reqId,
            notModified: true
        });
        return;
    }
    const html = renderer.getHtml(msg.languages, type, msg.name);
    const js = renderer.getJs(msg.languages, type, msg.name);
    lastModifiedComponent = cacheMgr.getLastModified(type[0] + '#' + msg.name);
    if (lastModifiedComponent === -1){
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
        lastModified: lastModifiedComponent
    })
}

module.exports = {handle};
