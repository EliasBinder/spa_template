class IntercomConnection {

    constructor(socket) {
        this.socket = socket;
        this.uuid = require('crypto').randomUUID()
        CONNECTIONS.set(socket, this);
    }

    emit(channel, msg) {
        this.socket.emit('intercom', {
            id: this.uuid,
            channel,
            msg
        })
    }

    getId() {
        return this.uuid;
    }
}

const CONNECTIONS = new Map();

const getConnection = (socket) => {
    let connection = null;
    if (!CONNECTIONS.has(socket)){
        connection = new IntercomConnection(socket);
        CONNECTIONS.set(socket, connection);
    } else {
        connection = CONNECTIONS.get(socket.id);
    }
    return CONNECTIONS.get(socket);
}

module.exports = {
    IntercomConnection,
    getConnection
}