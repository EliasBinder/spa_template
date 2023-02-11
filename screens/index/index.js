const onUISocketReady = () => {
    //render specific screen based on url path
    if (window._spa.urlPath.length > 0) {
        const screen = window._spa.urlPath.shift();
        spa.setScreen(screen);
        return;
    }

    spa.setScreen('{{config:initialScreen}}');
}
