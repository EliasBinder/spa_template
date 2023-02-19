const {checkForParams} = require("../util");
const intercomHandlers = require("../intercomHandlers");
const intercomConnection = require("../../../util/serverSideComponents/intercomConnection");
const handle = (socket, msg) => {
    if (!checkForParams(msg, ['type', 'object', 'channel', 'msg']))
        return;

    const {type, object, channel, msg: message} = msg;

    const connection = intercomConnection.getConnection(socket);
    const handler = intercomHandlers.getHandler(type, object, channel);
    if (handler)
        handler(message, connection);
}

module.exports = {handle};