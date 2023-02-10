window._spa.history = {
    callbacks: new Map()
}

window.spa.history = {
    push: (url, callback) => {
        //Callback: When component is already loaded and back button is pressed, callback is called
        const uuid = uuidv4();

        history.pushState({
            id: uuid
        }, '', url);

        window._spa.history.callbacks.set(uuid, callback);
    }
}

window.addEventListener('popstate', (event) => {
    if (window._spa.history.callbacks.has(event.state.id))
        window._spa.history.callbacks.get(event.state.id)();
});