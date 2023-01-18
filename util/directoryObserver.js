const chokidar = require('chokidar');
const path = require('path');
const cacheMgr = require("./cacheMgr");
const observerCallbacks = require("../routes/socketio/observerCallbacks");

const watchObjectDirectory = (pathToWatch) => {
    const parentFolderName = path.basename(pathToWatch);
    chokidar.watch(pathToWatch).on('unlinkDir', (_path) => {
        const deletedComponent = _path.replace(pathToWatch + '/', '');
        observerCallbacks.onDeleted(parentFolderName[0], deletedComponent);
    });
    chokidar.watch(pathToWatch).on('change', (_path) => {
        const changedComponent = _path.replace(pathToWatch + '/', '');
        observerCallbacks.onModified(parentFolderName[0], changedComponent);
    });
}

const startWatching = () => {
    console.log("Starting to watch directories...");
    const componentsPath = path.join(__dirname, "../components");
    watchObjectDirectory(componentsPath);
    const screensPath = path.join(__dirname, "../screens");
    watchObjectDirectory(screensPath);
}

module.exports = {
    startWatching
}