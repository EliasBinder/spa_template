//Prepare internal api
window._spa = {
    loadingObject: {
        component: null,
        data: {}
    },
    currentScreen: null,
    componentIds: {}
}


//Prepare api

window.spa = {
    init: (callback) => {
            callback(window._spa.loadingObject.component, {...window._spa.loadingObject.data});
        }
}


//Create UI Socket
createSocket('ui', window.location.href).then(() => {
    addUIListeners(SOCKETS['ui'].socket);

    window.injectComponent = (container, component, loadingNode = null, data= {}) => {
        inject(container, component, 'c#', loadingNode, data);
        container.setAttribute('component', component);
    }

    window.setScreen = (screen, loadingNode = null, data = {}) => {
        inject(document.getElementById('app'), screen, 's#', loadingNode, data);
        window._spa.currentScreen = screen;
    }

    if (onUISocketReady !== undefined)
        onUISocketReady();
});
