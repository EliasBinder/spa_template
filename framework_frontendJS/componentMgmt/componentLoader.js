const _injectHTML = (container, html, component) => {
    const preprocess = document.createElement('div');
    preprocess.innerHTML = html;
    const parseChild = (child) => {
        if (child.hasAttribute('id')) {
            child.id = component.internalId + '-' + child.getAttribute('id');
        }
        if (child.getAttribute('for')) {
            child.setAttribute('for', component.internalId + '_' + child.getAttribute('for'));
        }
        if (child.children){
            for (let i = 0; i < child.children.length; i++) {
                parseChild(child.children[i]);
            }
        }
    }
    parseChild(preprocess);
    container.innerHTML = preprocess.innerHTML;
    container.setAttribute('component-id', component.internalId);
    component.setRootDiv(container);
}

const inject = (container, object, type, loadingContainer, data) => {

    //Display loading container
    if (loadingContainer) {
        container.style.display = 'none';
        loadingContainer.style.removeProperty('display');
    }

    //Get component from cache if it exists
    let localComponent = localStorage.getItem(type[0] + '#' + object);
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
        name: object,
        type
    }
    //Send request
    emitSocketSync('ui', 'req_component', reqData, (msg) => {
        if (msg.notFound) {
            msg.html = `<div style="color: red; font-size: 20px; font-weight: bold;">${type.toLowerCase()} with name ${object} not found</div>`;
            msg.js = '';
        } else {
            //Update cache
            if (!msg.notModified) {
                localStorage.setItem(type[0] + '#' + object, JSON.stringify({
                    html: msg.html,
                    js: msg.js,
                    lastModified: msg.lastModified
                }));
            }else {
                msg = localComponentObj;
            }
        }

        const componentId = uuidv4();
        const component = new Component(type, object, componentId);
        window._spa.componentIds[componentId] = component;
        if (msg.html) {
            _injectHTML(container, msg.html, component);
        }
        if (msg.js) {
            window._spa.loadingObject.props = data;
            window._spa.loadingObject.component = component;
            component.setProps(data);
            component.setOnReady(() => {
                eval(msg.js);
                window._spa.loadingObject.props = {};
                window._spa.loadingObject.component = null;
            });
        }

        //Hide loading container
        if (loadingContainer) {
            container.style.removeProperty('display');
            loadingContainer.style.display = 'none';
        }
    });
}