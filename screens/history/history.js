spa.init((component, data, urlPath) => {
    spa.history.push('history', undefined)

    //remove first element from urlPath array and return it
    const pathElement = urlPath.shift()
    let componentToLoad;

    switch (pathElement) {
        case 'comp1':
            componentToLoad = 'comp1'
            break;
        case 'comp2':
            componentToLoad = 'comp2'
            break;
        case 'comp3':
            componentToLoad = 'comp3'
            break;
        default:
            componentToLoad = 'comp1'
            break;
    }

    const navigator = component.getNavigator()

    const loadChildComponent = (componentToLoad) => {
        spa.injectComponent(component.getElementById('child-component'), componentToLoad, null, { navigator })
    }

    navigator.registerRoute('comp1', (data) => {
        loadChildComponent('test/comp1')
    })
    navigator.registerRoute('comp2', (data) => {
        loadChildComponent('test/comp2')
    })
    navigator.registerRoute('comp3', (data) => {
        loadChildComponent('test/comp3')
    })

    navigator.navigateTo(componentToLoad)

})