class ComponentTag extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        //get attributes name and data
        const name = this.getAttribute('name');
        const data = this.getAttribute('data');
        //inject component
        window.spa.injectComponent(this, name, null, data);
    }
}

customElements.define('spa-component', ComponentTag);