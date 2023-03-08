/**
 * Ths function removes all components and screens from local storage that are older than 7 days
 */
const componentCleanup = async () => {
    //Get all components and screens from local storage
    Object.keys(localStorage).forEach(key => {
        //Get last modified date
        const lastModified = JSON.parse(localStorage.getItem(key)).lastModified;
        //Check if component is older than 7 days, delete if so
        if (Date.now() - lastModified > 7 * 24 * 60 * 60 * 1000) {
            localStorage.removeItem(key);
        }
    })
}
//Execute cleanup async when page is loaded
componentCleanup()