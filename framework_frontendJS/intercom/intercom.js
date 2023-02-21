class Intercom {

    callbacks = new Map();

    constructor(socketId, intercomId, type, object) {
        this.type = type;
        this.id = intercomId;
        this.object = object;
        this.socketId = socketId;
    }

    on(channel, callback) {
        this.callbacks.set(channel, callback);
    }

    emit(channel, msg) {
        emitSocket(this.socketId, 'intercom', {
            type: this.type,
            object: this.object,
            channel,
            msg,
            id: this.id
        })
    }
}

_spa.intercom = {
    store: new Map()
}