const enums = require("./enums");
const path = require("path");
const fs = require("fs");
const config = require("../../../app.json");
const staticContentMgr = require("./frameworkFrontendMgr");
const uglifyJs = require("uglify-js");
const jsdom = require("jsdom");
const ServerSideComponent = require("./serverSideComponents/serverSideComponent");
const componentStore = require("./serverSideComponents/componentStore");

const compile = (type, object) => {
    console.log('Compiling ' + type + ' ' + object + '...')

    const cacheMgr = require("./cacheMgr");

    type = enums[type];

    let componentContent = '';

    const parseFile = (file) => {
        componentContent = fs.readFileSync(file, 'utf8');
    }

    const componentDir = path.join(__dirname, '../..', type.toLowerCase() + 's', object + '.yaspa');
    const parentDir = path.join(__dirname, '../..', type.toLowerCase() + 's');
    if (!path.normalize(componentDir).startsWith(path.normalize(parentDir))) //Prevent path traversal
        return;
    if (!fs.existsSync(componentDir))
        return;

    parseFile(componentDir);

    let htmlContent = '';
    let jsContent = '';

    //fill config values
    componentContent = componentContent.replace(/{{config:(.*?)}}/g, (match, p1) => {
        const path = p1.split('.');
        let value = config;
        path.forEach(p => {
            value = value[p];
        });
        return value;
    });

    if (!(type === 'SCREEN' && object === 'index')) {
        //preprocess component
        const componentDom = new jsdom.JSDOM(componentContent);
        const scripts = Object.values(componentDom.window.document.getElementsByTagName('script'));

        //exclude scripts
        if (Array.isArray(scripts) && scripts.length > 0) {
            //Prepare server-side component
            let serverSideComponent = null;
            const initServerSideComponent = () => {
                if (serverSideComponent === null) {
                    serverSideComponent = new ServerSideComponent(type, object);
                    componentStore.registerComponent(serverSideComponent);
                }
            }

            scripts.forEach(script => {
                const scriptContent = `(function(){ ${script.textContent} })();`;
                if (script.hasAttribute('target') && script.getAttribute('target') === 'server') {
                    //Server and Client Side component
                    initServerSideComponent();
                    const scriptFunction = Function('component', scriptContent);
                    scriptFunction(serverSideComponent);
                } else {
                    //Client Side component
                    jsContent += scriptContent;
                }
                script.parentNode.removeChild(script);
            });
        }

        //set html content
        htmlContent = componentDom.window.document.body.innerHTML;
    }else{
        htmlContent = componentContent;
    }

    if (type === 'SCREEN' && object === 'index' && htmlContent.includes('{{framework}}')) {
        htmlContent = htmlContent.replace('{{framework}}', '<script>' + staticContentMgr.getJsContent() + '</script>');
    }

    //Minify js in production mode
    if (config.mode === 'production') {
        const minifiedJs = uglifyJs.minify(jsContent);
        if (minifiedJs.error) {
            console.error(minifiedJs.error);
        } else {
            jsContent = minifiedJs.code;
        }
    }

    let toCache = {
        lastModified: Date.now()
    }
    if (htmlContent.trim() !== '')
        toCache.html = htmlContent;
    if (jsContent.trim() !== '')
        toCache.js = jsContent;
    if (toCache.html.trim() !== '' || toCache.js.trim() !== '')
        cacheMgr.CACHE.set(type[0] + '#' + object, toCache);
}

module.exports = {
    compile
}