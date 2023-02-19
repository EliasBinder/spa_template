const SharedObject = require("./sharedObject");
const Intercom = require("./intercom");

class ServerSideComponent {
    type = null;
    name = null;

    intercom = null;
    sharedObject = null;

    constructor(type, name) {
        this.type = type;
        this.name = name;
    }

    getIntercom() {
        if (!this.intercom)
            this.intercom = new Intercom(this.type, this.name);
        return this.intercom;
    }

    getSharedObject(scope) {
        if (!this.sharedObject)
            this.sharedObject = new SharedObject(this.getIntercom());
    }

}

module.exports = ServerSideComponent;