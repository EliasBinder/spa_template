const update_screen = (msg) => {
    switch (msg.action) {
        case 'delete':
            if (window._spa.currentScreen === msg.screen){
                console.warn("Screen deleted: " + msg.screen);
                document.getElementById('app').innerHTML = '<h1 style="color: red">Current screen deleted! Please reload this page or set another initial screen</h1>'
            }
    }
}