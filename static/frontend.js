//TODO: subdivide into more files

//Prepare api
window._spa = {
    loadingObject: {
        component: null,
        data: {}
    },
    currentScreen: null,
    componentIds: {}
}

const spa_init = (callback) => {
    callback(window._spa.loadingObject.component, {...window._spa.loadingObject.data});
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

            const componentId = uuidv4();
            if (msg.html) {
                const preprocess = document.createElement('div');
                preprocess.innerHTML = msg.html;
                const parseChild = (child) => {
                    if (child.hasAttribute('id')) {
                        child.id = componentId + '-' + child.getAttribute('id');
                    }
                    if (child.getAttribute('for')) {
                        child.setAttribute('for', componentId + '_' + child.getAttribute('for'));
                    }
                    if (child.children){
                        for (let i = 0; i < child.children.length; i++) {
                            parseChild(child.children[i]);
                        }
                    }
                }
                parseChild(preprocess);
                container.innerHTML = preprocess.innerHTML;
            }
            if (msg.js) {
                window._spa.loadingObject.data = data;
                const component = new Component(object, componentId);
                window._spa.componentIds[componentId] = component;
                window._spa.loadingObject.component = component;
                eval(msg.js);
                window._spa.loadingObject.data = {};
                window._spa.loadingObject.id = null;
            }

            if (loadingContainer)
                loadingContainer.style.display = 'none';

            //Observe component for changes (delete, change)
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
        window._spa.componentIds[component.id].destroy();

        const elements = document.querySelectorAll('[component="' + component + '"]');

        //recursively check all subcomponents weather they contain other componentMgmt
        let compsToRemove = new Map();
        const checkComponent = (element, isRootLayer) => {
            if (element.hasAttribute('component') && !isRootLayer) {
                if (element.getAttribute('component') !== component) {
                    //Add component to remove map
                    if (!compsToRemove.has(element.getAttribute('component')))
                        compsToRemove.set(element.getAttribute('component'), 1);
                    else
                        compsToRemove.set(element.getAttribute('component'), compsToRemove.get(element.getAttribute('component')) + 1);
                }else{
                    for (let i = 0; i < elements.length; i++) {
                        if (elements[i] === element){
                            elements.splice(i, 1);
                            break;
                        }
                    }
                }
            }
            const children = element.children;
            children.forEach((child) => {
                checkComponent(child, false);
            });
        }
        compsToRemove.forEach((value, key) => {
            const counted = document.querySelectorAll('[component="' + key + '"]').length;
            if (counted === value){
                emitSocket('ui', 'observe_component', {
                    component: key,
                    action: 'remove'
                });
            }
        });

        //Remove componentMgmt themself
        elements.forEach(element => {
            checkComponent(element, true);
            if (element.parentNode) { //Check if element is still in DOM
                element.innerHTML = `<div style="color: red; font-size: 20px; font-weight: bold;">component with name ${component} not found</div>`;
                element.removeAttribute('component');
            }
        });
    }
    if (onUISocketReady !== undefined)
        onUISocketReady();
});
