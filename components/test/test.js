spa.init((component, data) => {
    window.injectComponent(
        component.getElementById('info'),
        'info',
        null,
        {
            info: 'This information has been passed from the test component to the info component'
        }
    );
});
