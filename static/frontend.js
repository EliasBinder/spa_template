//Prepare api
window._spa = {
    loadingObject: {
        data: {}
    },
    currentScreen: null,
}

const spa_init = (callback) => {
    callback({...window._spa.loadingObject.data});
}

window.spa = {
    init: spa_init
}


//Create UI Socket
createSocket('ui', window.location.href).then(() => {
    addUIListeners(SOCKETS['ui'].socket);
    const inject = (container, object, prefix, loadingContainer, data) => {
        const type = prefix === 's#' ? 'screen' : 'component';

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
        const reqData = {
            languages: window.navigator.languages,
            lastModified,
            [type]: object
        }
        //Send request
        emitSocketSync('ui', 'req_' + type, reqData, (msg) => {
            if (msg.notFound) {
                msg.html = `<div style="color: red; font-size: 20px; font-weight: bold;">${type} with name ${object} not found</div>`;
                msg.js = '';
            } else {
                //Update cache
                if (!msg.notModified) {
                    localStorage.setItem(prefix + object, JSON.stringify({
                        html: msg.html,
                        js: msg.js,
                        lastModified: msg.lastModified
                    }));
                }else {
                    msg = localComponentObj;
                }
            }

            if (msg.html)
                container.innerHTML = msg.html;
            if (msg.js) {
                window._spa.loadingObject.data = data;
                eval(msg.js);
                window._spa.loadingObject.data = {};
            }

            if (loadingContainer)
                loadingContainer.style.display = 'none';

            //Observe component
            emitSocket('ui', 'observe_' + type, {
                [type]: object,
                action: 'add'
            });
        });
    }

    window.injectComponent = (container, component, loadingNode = null, data= {}) => {
        inject(container, component, 'c#', loadingNode, data);
        container.setAttribute('component', component);
    }

    window.setScreen = (screen, loadingNode = null, data = {}) => {
        inject(document.getElementById('app'), screen, 's#', loadingNode, data);
        window._spa.currentScreen = screen;
    }

    window.removeComponent = (component) => {
        emitSocket('ui', 'observe_component', {
            component,
            action: 'remove'
        });
        const elements = document.querySelectorAll('[component="' + component + '"]');
        //TODO: remove all subcomponents
        elements.forEach(element => {
            if (element.parentNode) { //Check if element is still in DOM
                element.innerHTML = `<div style="color: red; font-size: 20px; font-weight: bold;">component with name ${component} not found</div>`;
                element.removeAttribute('component');
            }
        });
    }
    if (onUISocketReady !== undefined)
        onUISocketReady();
});
