const {CACHE, readScreenToCache, readComponentToCache} = require('./cacheMgr');
const {passLang} = require('./languageParser');


const getHtml = (language, prefix, object) => {
    if (!CACHE.has(prefix + object)) {
        if (prefix === 's#')
            readScreenToCache(object);
        else if (prefix === 'c#')
            readComponentToCache(object);
    }
    const content = CACHE.get(prefix + object).html;
    return passLang(language, content);
}

const getJs = (language, prefix, object) => {
    if (!CACHE.has(prefix + object)) {
        if (prefix === 's#')
            readScreenToCache(object);
        else if (prefix === 'c#')
            readComponentToCache(object);
    }
    const content = CACHE.get(prefix + object).js;
    if (content === undefined)
        return '';
    return passLang(language, content);
}

const getScreenHtml = (language, screen) => {
    return getHtml(language, 's#', screen);
}

const getScreenJs = (language, screen) => {
    return getJs(language, 's#', screen);
}

const getComponentHtml = (language, component) => {
    return getHtml(language, 'c#', component);
}

const getComponentJs = (language, component) => {
    return getJs(language, 'c#', component);
}

module.exports = {getScreenHtml, getScreenJs, getComponentHtml, getComponentJs};
