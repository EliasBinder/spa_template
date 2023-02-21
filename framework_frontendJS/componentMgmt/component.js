class Component {

    registeredEvents = new Map();
    rootDiv = null;
    active = false;
    externalId = null;
    navigator = null;
    intercomId = undefined;

    onReady = () => {console.log('onLoaded not implemented')};
    ready = false;

    constructor(type, name, id) {
        this.type = type;
        this.name = name;
        this.internalId = id;
        this.active = true;

        //Observe component for changes (delete, change)
        emitSocketSync('ui', 'observe_component', {
            name,
            type,
            action: 'add'
        }, (data) => {
            this.intercomId = data.id;
            this.onReady();
            this.ready = true;
        });
    }

    //API

    setID(id) {
        if (this.externalId)
            delete window._spa.componentsMap[this.externalId]
        window._spa.componentsMap[this.externalId] = this;
    }

    setOnReady(callback) {
        if (this.ready)
            callback();
        else
            this.onReady = callback;
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
        const _name = this.name;
        const _type = this.type;
        //Stop observing component for changes
        const id = this.intercomId ? {id: this.intercomId} : {};
        emitSocket('ui', 'observe_component', {
            _name,
            _type,
            action: 'remove',
            ...id
        });
        if (window._spa.intercom.store.has(this.intercomId))
            window._spa.intercom.store.delete(this.intercomId);
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
        this.intercom = new Intercom('ui', this.intercomId, this.type, this.name);
        window._spa.intercom.store.set(this.intercomId, this.intercom);
        return this.intercom;
    }
}