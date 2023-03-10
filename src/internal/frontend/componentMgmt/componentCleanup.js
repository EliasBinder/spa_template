/**
 * Ths function removes all components and screens from local storage that are older than 7 days
 */
const componentCleanup = async () => {
    //Get all components and screens from local storage
    Object.keys(localStorage).forEach(key => {
        if (!key.startsWith('C#') && !key.startsWith('S#')) return;
        //Get last modified date
        const lastModified = JSON.parse(localStorage.getItem(key)).lastModified;
        //Check if component is older than 7 days, delete if so
        if (Date.now() - lastModified > 7 * 24 * 60 * 60 * 1000) {
            //FIXME: add saved timestamp to component and screen objects in local storage and only delete if older than 7 days
            localStorage.removeItem(key);
            console.log('Removed ' + key + ' from local storage')
        }
    })
}

//Execute cleanup async when page is loaded
componentCleanup()