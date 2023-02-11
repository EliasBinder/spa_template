spa.init((component, data, urlPath) => {

    const { navigator } = data;

    //spa.history.push('comp2', undefined)

    component.getElementById('nav').addEventListener('click', (e) => {
        navigator.navigateTo('comp1')
    })
})