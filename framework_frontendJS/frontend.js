//Prepare internal api
window._spa.loadingObject = {
    component: null,
    props: {}
}
window._spa.currentScreen = null
window._spa.componentIds = {}
window._spa.componentsMap = {}
window._spa.urlPath = []


//Prepare api
window.spa.init = (callback) => {
    callback(window._spa.loadingObject.component, {...window._spa.loadingObject.props}, window._spa.urlPath);
}
window.spa.getComponentById = (id) => {
    return _spa.componentsMap[id]
}

//set Url path
if (window.location.pathname !== '/' && window.location.pathname !== '') {
    //remove first and last / if present
    let url = window.location.pathname;
    if (url[0] === '/')
        url = url.substring(1);
    if (url[url.length - 1] === '/')
        url = url.substring(0, url.length - 1);
    //split url
    window._spa.urlPath = url.split('/');
}


//Create UI Socket
createSocket('ui', window.location.origin).then(() => {
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
