const {CACHE, readScreenToCache, readComponentToCache} = require('./cacheMgr');
const {parseContent} = require('./languageParser');


const getHtml = (languages, prefix, object) => {
    if (!CACHE.has(prefix + object)) {
        if (prefix === 's#')
            readScreenToCache(object);
        else if (prefix === 'c#')
            readComponentToCache(object);
    }
    const content = CACHE.get(prefix + object).html;
    return parseContent(languages, content);
}

const getJs = (languages, prefix, object) => {
    if (!CACHE.has(prefix + object)) {
        if (prefix === 's#')
            readScreenToCache(object);
        else if (prefix === 'c#')
            readComponentToCache(object);
    }
    const content = CACHE.get(prefix + object).js;
    if (content === undefined)
        return '';
    return parseContent(languages, content);
}

const getScreenHtml = (languages, screen) => {
    return getHtml(languages, 's#', screen);
}

const getScreenJs = (languages, screen) => {
    return getJs(languages, 's#', screen);
}

const getComponentHtml = (languages, component) => {
    return getHtml(languages, 'c#', component);
}

const getComponentJs = (languages, component) => {
    return getJs(languages, 'c#', component);
}

module.exports = {getScreenHtml, getScreenJs, getComponentHtml, getComponentJs};
