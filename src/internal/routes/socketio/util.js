const checkForParams = (msg, params) => {
    for (let param of params) {
        if (!msg.hasOwnProperty(param)) {
            return false;
        }
    }
    return true;
}

module.exports = {checkForParams};