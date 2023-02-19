const intercom = (msg) => {
    const {id, channel, msg: message = {}} = msg;
    const intercom = _spa.intercom.store.get(id);
    if (intercom && intercom.callbacks.get(channel)) {
        intercom.callbacks.get(channel)(message);
    }
}