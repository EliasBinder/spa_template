const fs = require("fs");
const path = require("path");
const appJson = require('../../../app.json');
const uglifyJs = require("uglify-js");

let jsContent = '';

const BUILD_ORDER = [
    'socketio/socketio.js',
    'util.js',
    'socketio/socketio-sync.js',
    'history/historyMgr.js',
    'navigation/navigator.js',
    'intercom/intercom.js',
    'componentMgmt/component.js',
    'componentMgmt/componentLoader.js',
    'componentMgmt/componentTag.js',
    'componentMgmt/componentCleanup.js',
    'uiFunctions/update_component.js',
    'uiFunctions/intercom.js',
    'socketio/uiSocketHandler.js',
    'frontend.js'
]

const build = () => {
    console.log('Building static content...');
    BUILD_ORDER.forEach(file => {
        jsContent += fs.readFileSync(path.join(__dirname, '..', 'frontend', file), 'utf8') + '\n';
    });
    if (appJson.mode === 'production'){
        //Minify code
        console.log('Minifying static content...');
        const minifiedJsContent = uglifyJs.minify(jsContent, {compress: true, mangle: true});
        if (minifiedJsContent.error)
            console.error("Could not minify code!", minifiedJsContent.error);
        else
            jsContent = minifiedJsContent.code;
    }
    console.log('Static content built.');
}

const getJsContent = () => {
    return jsContent;
}

module.exports = {build, getJsContent};
