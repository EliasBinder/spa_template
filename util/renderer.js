const {CACHE, compileToCache} = require('./cacheMgr');
const {parseContent} = require('./languageParser');


const getHtml = (languages, type, object) => {
    if (!CACHE.has(type[0] + '#' + object)) {
        compileToCache(type, object);
    }
    if (!CACHE.has(type[0] + '#' + object))
        return '';
    const content = CACHE.get(type[0] + '#' + object).html;
    if (content === undefined)
        return '';
    return parseContent(languages, content);
}

/**
 *
 * @param languages
 * @param type {string} 'SCREEN' or 'COMPONENT'
 * @param object
 * @returns {*|string}
 */
const getJs = (languages, type, object) => {
    if (!CACHE.has(type[0] + '#' + object)) {
        compileToCache(type, object);
    }
    if (!CACHE.has(type[0] + '#' + object))
        return '';
    const content = CACHE.get(type[0] + '#' + object).js;
    if (content === undefined)
        return '';
    return parseContent(languages, content);
}

module.exports = {getJs, getHtml};
