class Component {

    registeredEvents = new Map();
    rootDiv = null;
    active = false;

    constructor(name, id) {
        this.name = name;
        this.id = id;
        this.active = true;
    }

    //Dom manipulation

    getElementById(id) {
        return document.getElementById(this.id + '-' + id);
    }

    setRootDiv(div) {
        this.rootDiv = div;
    }

    getRootDiv() {
        return this.rootDiv;
    }

    //Lifecycle

    destroy() {
        if (this.rootDiv) {
            this.rootDiv.innerHTML = '';
            this.rootDiv.setAttribute('component-id', '');
            this.rootDiv.setAttribute('component', '');
            this.active = false;
            _spa.componentIds[this.id] = null;
        }
    }

    unlink() {
        if (this.rootDiv) {
            this.rootDiv.innerHTML = `<div style="color: red; font-size: 20px; font-weight: bold;">component with name ${this.name} not found</div>`;
        }
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