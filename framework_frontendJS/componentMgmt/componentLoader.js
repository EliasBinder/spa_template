const inject = (container, object, prefix, loadingContainer, data) => {
    const type = prefix === 's#' ? 'screen' : 'component';

    //Display loading container
    if (loadingContainer) {
        container.style.display = 'none';
        loadingContainer.style.removeProperty('display');
    }

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
        const component = new Component(object, componentId);
        window._spa.componentIds[componentId] = component;
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
            container.setAttribute('component-id', componentId);
            component.setRootDiv(container);
        }
        if (msg.js) {
            window._spa.loadingObject.data = data;
            window._spa.loadingObject.component = component;
            eval(msg.js);
            window._spa.loadingObject.data = {};
            window._spa.loadingObject.id = null;
        }

        if (loadingContainer) {
            container.style.removeProperty('display');
            loadingContainer.style.display = 'none';
        }

        //Observe component for changes (delete, change)
        emitSocket('ui', 'observe_' + type, {
            [type]: object,
            action: 'add'
        });
    });
}