const SOCKETS = {};

function createSocket(id, url) {
    return new Promise((resolve, reject) => {
        const socket = io(url);
        SOCKETS[id] = {
            'socket': socket,
            'url': url,
            'callbacks': {}
        };
        socket.on('resp', function (msg) {
            const reqId = msg.reqId;
            const callback = SOCKETS[id].callbacks[reqId];
            if (callback) {
                callback(msg);
                delete SOCKETS[id].callbacks[reqId];
            }
        })
        socket.on('connect', () => {
            console.log('Socket "' + id + '" connected successfully.');
            resolve(socket);
        });
    });
}

function emitSocketSync(socketId, channel, data, responseCallback) {
    const socket = SOCKETS[socketId].socket;
    if (socket.connected) {
        const reqId = uuidv4();
        SOCKETS[socketId].callbacks[reqId] = responseCallback;
        socket.emit(channel, {
            reqId,
            ...data
        });
    }
}

function emitSocket(socketId, channel, data) {
    const socket = SOCKETS[socketId].socket;
    if (socket.connected) {
        socket.emit(channel, data);
    }
}
