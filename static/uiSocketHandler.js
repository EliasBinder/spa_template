const addUIListeners = (socket) => {
    socket.on('update_component', (msg) => {
       update_component(msg);
    });
    socket.on('update_screen', (msg) => {
        update_screen(msg);
    });
}