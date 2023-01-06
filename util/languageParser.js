const fs = require("fs");
const path = require("path");

const LANGCACHE = new Map();

const parseLanguagesFiled = (languages) => {
    if (Array.isArray(languages)) {
        let result = [];
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
        return result;
    }
    return ['en'];
}

const parseContent = (languages, input) => {
    languages = parseLanguagesFiled(languages);
    let langToUse = 'en';
    for (let lang of languages) {
        if (LANGCACHE.has(lang) || fs.existsSync(path.join(__dirname, '..', 'languages', lang + '.json'))) {
            langToUse = lang;
            break;
        }
    }

    let langJson = {}
    if (LANGCACHE.has(langToUse)) {
        langJson = LANGCACHE.get(langToUse);
    } else {
        langJson = require(`../languages/${langToUse}.json`);
        LANGCACHE.set(langToUse, langJson);
    }

    return input.replace(/{{lang:(.*?)}}/g, (match, p1) => {
        return langJson[p1] || '';
    });
}

module.exports = {parseContent};
