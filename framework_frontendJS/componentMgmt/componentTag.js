class ComponentTag extends HTMLElement {

    skipOnAttribChange = false;

    constructor() {
        super();
    }

    connectedCallback() {
        //get attributes name and props
        const name = this.getAttribute('name');
        if (!name) return
        const props = this.getAttribute('props');
        //parse props
        const parsedProps = props ? JSON.parse(props) : {};
        //inject component
        window.spa.injectComponent(this, name, null, parsedProps);
    }

    disconnectedCallback() {
        //get component id
        const componentId = this.getAttribute('component-id');
        if (!componentId) return
        //remove component
        window._spa.componentIds[componentId]?.destroy();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return
        if (this.skipOnAttribChange) return
        if (name === 'name' || name === 'props') {
            //get component id
            const componentId = this.getAttribute('component-id');
            if (!componentId) return
            //remove component
            window.spa.getComponentById(componentId).destroy();
            //inject component
            window.spa.injectComponent(this, newValue, null, {});
        }
    }

    static get observedAttributes() {
        return ['name', 'props'];
    }

    loadComponent(component, props) {
        //get component id
        const componentId = this.getAttribute('component-id');
        if (componentId)
            //remove component
            window.spa.getComponentById(componentId).destroy();
        this.skipOnAttribChange = true;
        this.setAttribute('name', component);
        this.skipOnAttribChange = false;
        //inject component
        window.spa.injectComponent(this, component, null, props);
    }
}

customElements.define('ya-spa', ComponentTag);