const addUIListeners = (socket) => {
    socket.on('update_component', (msg) => {
       update_component(msg);
    });

    socket.on('intercom', (msg) => {
        intercom(msg);
    });
}