const chokidar = require('chokidar');
const path = require('path');
const cacheMgr = require("./cacheMgr");
const observerCallbacks = require("../socketio/observerCallbacks");

const watchObjectDirectory = (pathToWatch) => {
    const parentFolderName = path.basename(pathToWatch);
    chokidar.watch(pathToWatch).on('unlinkDir', (_path) => {
        observerCallbacks.onDeleted(parentFolderName[0], path.basename(_path));
    });
}

const startWatching = () => {
    console.log("Starting to watch directories...");
    const componentsPath = path.join(__dirname, "../componentMgmt");
    watchObjectDirectory(componentsPath);
    const screensPath = path.join(__dirname, "../screens");
    watchObjectDirectory(screensPath);
}

module.exports = {
    startWatching
}