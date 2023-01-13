class Component {

    registeredEvents = new Map;

    constructor(name, id) {
        this.name = name;
        this.id = id;
    }

    //Dom manipulation

    getElementById(id) {
        return document.getElementById(this.id + '-' + id);
    }

    //Lifecycle

    destroy() {

    }

    //Inter component communication

    on(event, callback) {
        this.registeredEvents.set(event, callback);
    }

    emit(event, data) {
        if (this.registeredEvents.has(event))
            this.registeredEvents.get(event)(data);
    }
}