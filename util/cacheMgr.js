const fs = require("fs");
const path = require("path");
const config = require('../app.json');
const staticContentMgr = require("./staticContentMgr");

const CACHE = new Map();

const readToCache = (type, object) => {
    let htmlContent = '';
    let cssContent = '';
    let jsContent = '';

    const parseFile = (file) => {
        if (path.extname(file) === '.html') {
            htmlContent += fs.readFileSync(file, 'utf8') + '\n';
        } else if (path.extname(file) === '.css') {
            cssContent += fs.readFileSync(file, 'utf8') + '\n';
        } else if (path.extname(file) === '.js') {
            jsContent += fs.readFileSync(file, 'utf8') + '\n';
        }
    }

    const parseDir = (dir) => {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            if (fs.lstatSync(filePath).isFile()) {
                parseFile(filePath);
            } else if (fs.lstatSync(filePath).isDirectory()) {
                parseDir(filePath);
            }
        });
    }

    if (!fs.existsSync(path.join(__dirname, '..', type + 's', encodeURIComponent(object))))
        return;

    parseDir(path.join(__dirname, '..', type + 's', encodeURIComponent(object)));

    //combine html and css
    if (cssContent.trim() !== '') {
        if (htmlContent.includes('{{style}}')) {
            htmlContent = htmlContent.replace('{{style}}', `<style>${cssContent}</style>`);
        } else {
            htmlContent += `<style>${cssContent}</style>`;
        }
    }

    //fill html and js with config values
    htmlContent = htmlContent.replace(/{{config:(.*?)}}/g, (match, p1) => {
        return config[p1] || '';
    });
    jsContent = jsContent.replace(/{{config:(.*?)}}/g, (match, p1) => {
        return config[p1] || '';
    });

    if (type === 'screen' && object === 'index' && htmlContent.includes('{{framework}}')) {
        htmlContent = htmlContent.replace('{{framework}}', '<script>' + staticContentMgr.getJsContent() + '</script>');
    }

    if (type === 'screen') {
        if (htmlContent.includes('{{script}}')) {
            htmlContent = htmlContent.replace('{{script}}', `<script>${jsContent}</script>`);
            jsContent = '';
        }else {
            console.warn('Screen ' + object + ' does not have a script placeholder. It\'s javascript will not be loaded.');
        }
    }

    let toCache = {
        lastModified: Date.now()
    }
    if (htmlContent.trim() !== '')
        toCache.html = htmlContent;
    if (jsContent.trim() !== '')
        toCache.js = jsContent;
    CACHE.set(type[0] + '#' + object, toCache);
}

const readScreenToCache = (screen) => {
    readToCache('screen', screen);
}

const readComponentToCache = (component) => {
    readToCache('component', component);
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
    readScreenToCache,
    readComponentToCache,
    getLastModified
}
