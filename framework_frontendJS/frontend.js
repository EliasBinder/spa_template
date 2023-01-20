//Prepare internal api
window._spa = {
    loadingObject: {
        component: null,
        data: {}
    },
    currentScreen: null,
    componentIds: {},
    componentsMap: {}
}


//Prepare api

window.spa = {
    init: (callback) => {
            callback(window._spa.loadingObject.component, {...window._spa.loadingObject.data})
        },

    getComponentById: (id) => {
            return _spa.componentsMap[id]
        }
}


//Create UI Socket
createSocket('ui', window.location.href).then(() => {
    addUIListeners(SOCKETS['ui'].socket);

    window.spa.injectComponent = (container, component, loadingNode = null, data= {}) => { //TODO: shrink parameters
        inject(container, component, 'COMPONENT', loadingNode, data);
        container.setAttribute('component', component);
    }

    window.spa.setScreen = (screen, loadingNode = null, data = {}) => { //TODO: shrink parameters
        inject(document.getElementById('app'), screen, 'SCREEN', loadingNode, data);
        window._spa.currentScreen = screen;
    }

    if (onUISocketReady !== undefined)
        onUISocketReady();
});
