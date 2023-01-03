const fs = require("fs");
const path = require("path");

const LANGCACHE = new Map();

const passLang = (langauge, input) => {
    if (!fs.existsSync(path.join(__dirname, 'lang', langauge + '.json')))
        langauge = 'en';

    let langJson = {};

    if (LANGCACHE.has(langauge)) {
        langJson = LANGCACHE.get(langauge);
    } else {
        langJson = require(`../lang/${langauge}.json`);
        LANGCACHE.set(langauge, langJson);
    }

    return input.replace(/{{lang:(.*?)}}/g, (match, p1) => {
        return langJson[p1] || '';
    });
}

module.exports = {passLang};
