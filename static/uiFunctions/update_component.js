const update_component = (msg) => {
    switch (msg.action) {
        case 'delete':
            console.warn("Component deleted: " + msg.component);
            emitSocket('ui', 'observe_component', {
                component: msg.component,
                action: 'remove'
            });
            //Update UI
            const components = document.querySelectorAll('[component="' + msg.component + '"]');
            if (components.length !== 0){
                for (let component of components) {
                    _spa.componentIds[component.getAttribute('component-id')].unlink();
                }
            }
            //Remove from cache
            localStorage.removeItem('c#' + msg.component);
            break;
    }
}