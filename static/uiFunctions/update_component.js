const update_component = (msg) => {
    switch (msg.action) {
        case 'delete':
            console.warn("Component deleted: " + msg.component);
            window.removeComponent(msg.component);
            localStorage.removeItem('c#' + msg.component);
            break;
    }
}