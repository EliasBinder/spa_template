const componentStore = require("./componentStore");

class IntercomConnection {

    constructor(socket, objectType, objectName) {
        this.socket = socket;
        this.objectType = objectType;
        this.objectName = objectName;
        this.uuid = require('crypto').randomUUID()
        CONNECTIONS.set(this.uuid, this);
        if (socket.intercomIds)
            socket.intercomIds.push(this.uuid);
        else
            socket.intercomIds = [this.uuid];
        componentStore.getComponent(objectType, objectName)?.getIntercom().addConnection(this);
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

    destroy() {
        this.socket.intercomIds.splice(this.socket.intercomIds.indexOf(this.uuid), 1);
        CONNECTIONS.delete(this.uuid);
        componentStore.getComponent(this.objectType, this.objectName)?.getIntercom().removeConnection(this);
    }
}

const CONNECTIONS = new Map();

const getConnection = (socket, id) => {
    if (!socket.intercomIds.some(_id => _id === id)) return null; //check if the id belongs to the socket
    return CONNECTIONS.get(id);
}

module.exports = {
    IntercomConnection,
    getConnection
}