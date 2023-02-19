class ComponentTag extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        //get attributes name and props
        const name = this.getAttribute('name');
        const props = this.getAttribute('props');
        //parse props
        const parsedProps = props ? JSON.parse(props) : {};
        //inject component
        window.spa.injectComponent(this, name, null, parsedProps);
    }
}

customElements.define('ya-spa', ComponentTag);