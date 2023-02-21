class ComponentTag extends HTMLElement {
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
        window.spa.getComponentById(componentId).destroy();
    }
}

customElements.define('ya-spa', ComponentTag);