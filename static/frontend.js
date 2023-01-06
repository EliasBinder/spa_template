//Prepare api
window._spa = {
    loadingObject: {
        data: {}
    }
}

const spa_init = (callback) => {
    callback(window._spa.loadingObject.data);
}

window.spa = {
    init: spa_init
}


//Create UI Socket
createSocket('ui', window.location.href).then(() => {
    const inject = (container, object, prefix, loadingContainer, data) => {
        //Display loading container
        if (loadingContainer)
            loadingContainer.style.removeProperty('display');

        //Get component from cache if it exists
        let localComponent = localStorage.getItem(prefix + object);
        let localComponentObj;
        let lastModified = 0;
        if (localComponent) {
            localComponentObj = JSON.parse(localComponent)
            lastModified = localComponentObj.lastModified;
        }

        //Prepare request data
        let reqData = {
            languages: window.navigator.languages,
            lastModified,
        }
        if (prefix === 'c#')
            reqData.component = object;
        else
            reqData.screen = object;

        emitSocketSync('ui', prefix==='c#'?'req_component':'req_screen', reqData, (msg) => {
            console.log("msg", msg);
            if (msg.notModified)
                msg = localComponentObj;
            if (msg.html)
                container.innerHTML = msg.html;
            if (msg.js) {
                window._spa.loadingObject.data = data;
                eval(msg.js);
                window._spa.loadingObject.data = {};
            }
            if (loadingContainer)
                loadingContainer.style.display = 'none';
            localStorage.setItem(prefix + object, JSON.stringify({html: msg.html, js: msg.js, lastModified: msg.lastModified}));
        });
    }
    window.injectComponent = (container, component, loadingNode = null, data= {}) => {
        inject(container, component, 'c#', loadingNode, data);
    }
    window.setScreen = (screen, loadingNode = null, data = {}) => {
        inject(document.getElementById('app'), screen, 's#', loadingNode, data);
    }
    if (onUISocketReady !== undefined)
        onUISocketReady();
});
