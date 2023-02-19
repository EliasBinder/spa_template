const intercomHandlers = require("../../routes/socketio/intercomHandlers");

class Intercom {

    connections = [];

    constructor(type, object) {
        this.type = type;
        this.object = object;
    }

    on(channel, callback) {
        intercomHandlers.registerHandler(this.type, this.object, channel, callback);
    }

    getConnections() {
        return this.connections;
    }

    addConnection(connection) {
        this.connections.push(connection);
    }

    removeConnection(connection) {
        this.connections = this.connections.filter(c => c !== connection);
    }

}

module.exports = Intercom;