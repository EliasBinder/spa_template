spa.init((component, data) => {
    spa.injectComponent(
        component.getElementById('info'),
        'test/info',
        null,
        {
            info: 'This information has been passed from the test component to the info component'
        }
    );
});
