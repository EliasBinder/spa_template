const HANDLERS = new Map();

const registerHandler = (type, component, channel, handler) => {
    HANDLERS.set(type[0].toUpperCase() + '#' + component + '#' + channel, handler);
}

const getHandler = (type, component, channel) => {
    return HANDLERS.get(type[0].toUpperCase() + '#' + component + '#' + channel);
}

const removeHandler = (type, component, channel) => {
    HANDLERS.delete(type[0].toUpperCase() + '#' + component + '#' + channel);
}

module.exports = {
    registerHandler,
    getHandler,
    removeHandler
}