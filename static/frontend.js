createSocket('ui', window.location.href).then(() => {
    const inject = (container, object, prefix, loadingContainer) => {
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
            language: 'en',
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
            if (msg.js)
                eval(msg.js);
            if (loadingContainer)
                loadingContainer.style.display = 'none';
            localStorage.setItem(prefix + object, JSON.stringify({html: msg.html, js: msg.js, lastModified: msg.lastModified}));
        });
    }
    window.injectComponent = (container, component, loadingNode = null) => {
        inject(container, component, 'c#', loadingNode);
    }
    window.setScreen = (screen, loadingNode = null) => {
        inject(document.getElementById('app'), screen, 's#', loadingNode);
    }
    if (onUISocketReady !== undefined)
        onUISocketReady();
});
