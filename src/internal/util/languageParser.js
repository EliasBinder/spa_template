const fs = require("fs");
const path = require("path");

const LANGCACHE = new Map();
const LANGCACHE_LASTCHANGED = new Map();

const parseLanguagesField = (languages) => {
    let result = [];
    if (Array.isArray(languages)) {
        languages.forEach((lang) => {
            let simplifiedLang;
            if (lang.includes('-'))
                simplifiedLang = lang.split('-')[0].toLowerCase();
            else if (lang.includes('_'))
                simplifiedLang = lang.split('_')[0].toLowerCase();
            else
                simplifiedLang = lang.toLowerCase();
            if (!result.includes(simplifiedLang))
                result.push(encodeURIComponent(simplifiedLang));
        });
    } else {
        result.push('en');
    }
    let langToUse = 'en';
    for (let lang of languages) {
        if (LANGCACHE.has(lang) || fs.existsSync(path.join(global.cwd, 'src/languages', lang + '.json'))) {
            langToUse = lang;
            break;
        }
    }
    return langToUse;
}

const updateLangInCache = (lang) => {
    if (LANGCACHE.has(lang)) {
        if (LANGCACHE_LASTCHANGED.get(lang) !== lastChanged(lang)) {
            LANGCACHE.set(lang, require(path.join(global.cwd, `src/languages/${lang}.json`)));
            LANGCACHE_LASTCHANGED.set(lang, lastChanged(lang));
        }
    } else {
        LANGCACHE.set(lang, require(path.join(global.cwd, `src/languages/${lang}.json`)));
        LANGCACHE_LASTCHANGED.set(lang, lastChanged(lang));
    }
}

const parseContent = (language, input) => {
    let langToUse = parseLanguagesField(language);

    updateLangInCache(langToUse);
    let langJson = LANGCACHE.get(langToUse);

    return input.replace(/{{lang:(.*?)}}/g, (match, p1) => {
        return langJson[p1] || '';
    });
}

const lastChanged = (lang) => {
    return fs.statSync(path.join(global.cwd, 'src', 'languages', lang + '.json')).mtime;
}

module.exports = {parseLanguagesField, parseContent, lastChanged};
