class Navigator {

    routes = new Map();
    rootPath = [];
    lastNav = null;

    constructor() {
        this.rootPath = [...window._spa.history.path];
    }

    registerRoute(name, onLoad, onUnload = null) {
        this.routes.set(name, {
            onLoad: onLoad,
            onUnload: onUnload
        });
    }

    unregisterRoute(name) {
        this.routes.delete(name);
    }

    navigateTo(name, data = {}) {
        const navigate = (name) => {
            this.routes.get(name).onLoad({...data});
        }
        if (this.routes.has(name)) {
            window.spa.history.set([...this.rootPath, name], ({ name }) => {
                if (name) {
                    navigate(name);
                }
            }, { name: name.repeat(1) }); //repeat 1 for deep copy
            navigate(name)
            this.lastNav = name;
        }
    }
}