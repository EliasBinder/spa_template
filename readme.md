# SPA Template

## Description
This is a template for building single page applications.
It uses a component and screen logic, known from React for example, to build the application.
Internally, a minimalistic html code is sent to the client, which then loads the application and renders the components using Socket-IO to avoid the HTTP overhead and achieve faster loading times.
In addition, the server and client both use caching to reduce loading times even further.

## Installation
Clone the repository and run `npm install` to install all dependencies.
Finally, run `npm start` to start the server.

## Getting started

### Screens
Screens are the main "parts" of your application. For example, you can have a login screen, a dashboard screen, a settings screen, etc.
In order to create a screen, create a new folder in the `screens` folder with the name of your screen and put a `.html` file in it. This file will be the main html file of the screen.
Note that you can add css and js files as you wish, even several of one type. The server will automatically load them. 
Note that it is sufficient to write only partial html code, tags like head, body, ... can be omitted, as those screens will be rendered directly into the `#app` div that can be found in the index screen. 
The index screen is only meant to provide the framework and to load other screens. So only it is allowed to have a full html file.
In order to set a different screen use:
```
window.setScreen('screen-name'); // The name of the screen, in particular the name of the screen's folder
```

### Components
Components are the building blocks of your application. They are used to build the screens.
In order to create a component, create a new folder with the name of you component in the `components` folder and put a `.html` file in it. This file will be the main html file of the component.
In order to load a component into a div specified in another component or div, you can use
```
window.injectComponent(
    document.getElementById('div-id'), // The div to inject the component into
    'component-name', // The name of the component to inject, in particular the name of the component's folder
);
```

## ToDos:
- [x] Add automatic language detection -> replace hard coded `en`
- [ ] Rewrite documentation in readme.md
- [ ] Add possibility to use jsx
- [ ] Add back button feature and unique paths in url
- [x] Allow for information to be passed through component hierarchy
- [ ] Allow sever managed components
  - [ ] Add live preview of development
- [x] Dump cache on server restart

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Notes regarding the internal structure
- The server is built using Express and Socket-IO.
- The minimalistic index screen is served using express and `/routes/index.js`.
- When requesting a component, the html and css is combined, values from the app.json are inserted and the result is sent to the client and cached for further requests.
  - The goal of that is to safe server resources when requesting the same component multiple times while at the same time simplifying the development of components and screens.
- The SocketIO communication with the client is handles in `/socketio/*`
- The frontend javascript code is located in `/static/*`
  - It contains the SocketIO client library and an extension for a synchronous communication with the server, as well as the logic to inject components into divs.
- The `/utils` folder contains the logic for reading, caching and parsing components based on what is requested by the client.


