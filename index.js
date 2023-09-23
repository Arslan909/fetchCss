document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggleExtension");

    toggleButton.addEventListener("click", function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const tabId = tabs[0].id;
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                function: fetchCss
            });
        });
    });
});

// TODO- a d way to tempory block the sites intraction temporarily (extension is kinda useless without that)
// - add a 'copy to clipboard' button to the properties list container (maybe a search with properties feature?)
// - modify the code to add the pseudo class properties in the list
// - toggle extension functionality
// damn thats alot of todo 

function fetchCss(element) {
    // this is just to create a ul element(list div containing property and values of the element) and set the css of that dic for a pop up view
    const propertyList = document.createElement("ul");

    propertyList.id = "proprty-list";
    const x = event.clientX + 10; 
    const y = event.clientY + 10;

    propertyList.style.left = `${x}px`;
    propertyList.style.top = `${y}px`;

    propertyList.style.position = "fixed";
    propertyList.style.backgroundColor = "white";
    propertyList.style.border = "1px solid #ccc";
    propertyList.style.padding = "10px";

    propertyList.style.width = "40%";
    propertyList.style.height = "50%";
    propertyList.style.display = "none";
    propertyList.style.overflowY = "scroll";


    // this part fetch the propertis of the element passed to it and then append those properties and its values to the list
    const compStyles = window.getComputedStyle(element);
    for (let i = 0; i < compStyles.length; i++) {
        const property = compStyles[i];
        const value = compStyles.getPropertyValue(property);

        const listItem = document.createElement("li");
        listItem.textContent = `${property}: ${value}`;

        propertyList.appendChild(listItem);
    }

    document.body.appendChild(propertyList);
    propertyList.style.display = "block";

}


// this will get the element on the page that user clicked and pas it to a function which fetches its css
document.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopImmediatePropagation()

    const element = event.target;

    // Check if the current URL starts with "http" or "https" to ensure it's a web page.
    if (window.location.href.startsWith('http') || window.location.href.startsWith('https')) {
        fetchCss(element, event);
    }
}, true);
