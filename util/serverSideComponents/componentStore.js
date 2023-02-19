const COMPONENT_STORE = new Map();

const registerComponent = (component) => {
    COMPONENT_STORE.set(component.type[0].toUpperCase() + '#' + component.name, component);
}

const getComponent = (componentType, componentName) => {
    return COMPONENT_STORE.get(componentType[0].toUpperCase() + '#' + componentName);
}

const getComponentNames = () => {
    return Array.from(COMPONENT_STORE.keys());
}

module.exports = {
    registerComponent,
    getComponent,
    getComponentNames
}