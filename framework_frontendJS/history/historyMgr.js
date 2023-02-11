window._spa.history = {
    callbacks: new Map(),
    path: []
}

window.spa.history = {
    push: (pathElement, callback, additionalData = null) => {
        //Callback: When component is already loaded and back button is pressed, callback is called
        window._spa.history.path.push(pathElement);

        const uuid = uuidv4();

        history.pushState({
            id: uuid,
            additionalData
        }, '', '/' + window._spa.history.path.join('/'));

        if (callback)
            window._spa.history.callbacks.set(uuid, callback);
    },

    set: (path, callback, additionalData = null) => {
        const uuid = uuidv4();

        history.pushState({
            id: uuid,
            additionalData
        }, '', '/' + path.join('/'));

        if (callback)
            window._spa.history.callbacks.set(uuid, callback);
    }
}

window.addEventListener('popstate', (event) => {
    if (window._spa.history.callbacks.has(event.state.id))
        window._spa.history.callbacks.get(event.state.id)(event.state.additionalData);
});