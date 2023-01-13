const fs = require("fs");
const path = require("path");

let jsContent = '';

const BUILD_ORDER = [
    'socketio/socketio.js',
    'util.js',
    'socketio/socketio-sync.js',
    'componentMgmt/component.js',
    'uiFunctions/update_component.js',
    'uiFunctions/update_screen.js',
    'socketio/uiSocketHandler.js',
    'frontend.js'
]

const build = () => {
    console.log('Building static content...');
    BUILD_ORDER.forEach(file => {
        jsContent += fs.readFileSync(path.join(__dirname, '..', 'static', file), 'utf8') + '\n';
    });
    console.log('Static content built.');
}

const getJsContent = () => {
    return jsContent;
}

module.exports = {build, getJsContent};
