class Component {

    registeredEvents = new Map();
    rootDiv = null;
    active = false;
    externalId = null;
    navigator = null;

    constructor(type, name, id) {
        this.type = type;
        this.name = name;
        this.internalId = id;
        this.active = true;
        this.intercom = new Intercom('ui', this.type, this.name);

        //Observe component for changes (delete, change)
        emitSocketSync('ui', 'observe_component', {
            name,
            type,
            action: 'add'
        }, (data) => {
            window._spa.intercom.store.set(data.id, this.intercom);
        });
    }

    //API

    setID(id) {
        if (this.externalId)
            delete window._spa.componentsMap[this.externalId]
        window._spa.componentsMap[this.externalId] = this;
    }

    //Dom manipulation

    getElementById(id) {
        return document.getElementById(this.internalId + '-' + id);
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
            this.rootDiv.innerHTML = `<span style="color: red; font-size: 20px; font-weight: bold;">component with name ${this.name} not found</span>`;
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

    //Navigation

    getNavigator() {
        //Lazy initialization of navigator because not all components need it
        if (this.navigator === null)
            this.navigator = new Navigator();
        return this.navigator;
    }

    //Intercom with server side component
    getIntercom() {
        return this.intercom;
    }
}