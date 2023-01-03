createSocket('ui', window.location.href).then(() => {
    window.injectComponent = (container, component) => {
        emitSocketSync('ui', 'req_component', {component, language: 'en'}, (msg) => {
            if (msg.html)
                container.innerHTML = msg.html;
            if (msg.js)
                eval(msg.js);
        });
    }
    if (onUISocketReady !== undefined)
        onUISocketReady();
});
