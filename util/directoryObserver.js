const chokidar = require('chokidar');
const path = require('path');
const cacheMgr = require("./cacheMgr");
const observerCallbacks = require("../routes/socketio/observerCallbacks");
const fs = require("fs");
const enums = require("./enums");

const watchObjectDirectory = (pathToWatch, type) => {
    chokidar.watch(pathToWatch).on('unlink', (_path) => {
        const deletedComponent = _path.replace(pathToWatch + '/', '');
        observerCallbacks.onDeleted(type, deletedComponent);
    });
    chokidar.watch(pathToWatch).on('change', (_path) => {
        let changedComponent  = path.basename(_path, path.extname(_path));
        observerCallbacks.onModified(type, changedComponent);
    });
}

const startWatching = () => {
    console.log("Starting to watch directories...");
    const componentsPath = path.join(__dirname, "../components");
    watchObjectDirectory(componentsPath, enums.COMPONENT);
    const screensPath = path.join(__dirname, "../screens");
    watchObjectDirectory(screensPath, enums.SCREEN);
}

module.exports = {
    startWatching
}