const {checkForParams} = require("../util");
const intercomHandlers = require("../intercomHandlers");
const intercomConnection = require("../../../util/serverSideComponents/intercomConnection");
const handle = (socket, msg) => {
    if (!checkForParams(msg, ['type', 'object', 'channel', 'msg', 'id']))
        return;

    const {type, object, channel, msg: message, id} = msg;

    const connection = intercomConnection.getConnection(socket, id);
    const handler = intercomHandlers.getHandler(type, object, channel);
    if (handler)
        handler(message, connection);
}

module.exports = {handle};