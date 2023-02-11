spa.init((component, data, urlPath) => {

    const { navigator } = data;

    //spa.history.push('comp1', undefined);

    component.getElementById('nav').addEventListener('click', (e) => {
        navigator.navigateTo('comp2')
    })

    component.getElementById('nav2').addEventListener('click', (e) => {
        navigator.navigateTo('comp3')
    })
})