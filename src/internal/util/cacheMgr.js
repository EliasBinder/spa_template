const fs = require("fs");
const path = require("path");
const enums = require('./enums');
const componentCompiler = require('./componentCompiler');

const CACHE = new Map();

const cache2File = () => {
    console.log('Exporting cache to file...');
    const cacheFile = path.join(global.cwd, 'cache.json');
    fs.writeFileSync(cacheFile, JSON.stringify(Object.fromEntries(CACHE)), 'utf8');
    console.log('Cache exported to file.');
}

const file2Cache = () => {
    console.log('Importing cache from file...');
    const cacheFile = path.join(global.cwd, 'cache.json');
    if (fs.existsSync(cacheFile)) {
        const cache = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
        for (let key in cache) {
            //compile the object again to make sure it's up-to-date
            componentCompiler.compile(key[0]==='C' ? enums.COMPONENT : enums.SCREEN, key.substr(2));

            const newCachedItem = CACHE.get(key);
            if (newCachedItem) {
                //compare if the object in the cache file is equal to the compiled object
                if (cache[key].html === newCachedItem.html && cache[key].js === newCachedItem.js) {
                    //if equal, update the lastModified value
                    newCachedItem.lastModified = cache[key].lastModified;
                }
            }
        }
    }
    console.log('Cache imported from file.');
}

const getLastModified = (key) => {
    const item = CACHE.get(key);
    if (item) {
        return item.lastModified;
    }
    return -1;
}

module.exports = {
    CACHE,
    cache2File,
    file2Cache,
    getLastModified
}
