const update_component = (msg) => {
    switch (msg.action) {
        case 'delete':
            console.warn(msg.type.toLowerCase() + " deleted: " + msg.name);
            emitSocket('ui', 'observe_component', {
                name: msg.name,
                type: msg.type,
                action: 'remove'
            });
            //Update UI
            if (msg.type === 'COMPONENT') {
                const components = document.querySelectorAll('[component="' + msg.name + '"]');
                if (components.length !== 0) {
                    for (let component of components) {
                        _spa.componentIds[component.getAttribute('component-id')].unlink();
                    }
                }
            } else if (msg.type === 'SCREEN') {
                if (window._spa.currentScreen === msg.screen)
                    document.getElementById('app').innerHTML = '<h1 style="color: red">Current screen deleted! Please reload this page or set another initial screen</h1>'
            }
            //Remove from cache
            localStorage.removeItem(msg.type[0] + '#' + msg.component);
            break;
        case 'modify':
            console.log(msg.type.toLowerCase() + " modified: " + msg.name);
            //Update UI
            let components2;
            if (msg.type === 'COMPONENT') {
                components2 = document.querySelectorAll('[component="' + msg.name + '"]');
            } else if (msg.type === 'SCREEN') {
                components2 = [document.getElementById('app')];
            }
            if (components2.length !== 0) {
                for (let component of components2) {
                    const _component = _spa.componentIds[component.getAttribute('component-id')];
                    if (msg.html)
                        _injectHTML(component, msg.html, _component);
                    if (msg.js) {
                        window._spa.loadingObject.props = _component.getProps();
                        window._spa.loadingObject.component = _component;
                        eval(msg.js);
                        window._spa.loadingObject.props = {};
                        window._spa.loadingObject.component = null;
                    }
                }
            } else {
                emitSocket('ui', 'observe_component', {
                    name: msg.name,
                    type: msg.type,
                    action: 'remove'
                });
            }
            //Update cache
            localStorage.setItem(msg.type[0] + '#' + msg.component, JSON.stringify({
                html: msg.html,
                js: msg.js,
                lastModified: new Date().getTime()
            }));
            break;
    }
}