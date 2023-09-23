let extensionEnabled = false;
let propertyList = null; // this will hold the property list DIV element

chrome.runtime.onMessage.addListener((message) => {
  if (message.enableScript) {
    extensionEnabled = message.enableScript;
  }
});

// this will set the intiall property of a properties list DIV
function createPropertyList() {
  if (!propertyList) {
    propertyList = document.createElement("div");
    propertyList.id = "property-list";

    propertyList.style.position = "fixed";
    propertyList.style.backgroundColor = "white";
    propertyList.style.border = "1px solid #ccc";
    propertyList.style.padding = "10px";

    propertyList.style.width = "40%";
    propertyList.style.height = "50%";
    propertyList.style.display = "none";
    propertyList.style.overflowY = "scroll";

    //handle click on th property list div(disable it)
    propertyList.addEventListener("click", function (event) {
      event.stopPropagation();
    });
  }
}

function clearPropertyList() {
  if (propertyList) {
    propertyList.textContent = '';
    propertyList.style.display = "none";
  }
}

function fetchCss(element, event) {
  const x = event.clientX + 10;
  const y = event.clientY + 10;

  propertyList.style.left = `${x}px`;
  propertyList.style.top = `${y}px`;

  const compStyles = window.getComputedStyle(element);

  // Store the properties and values in an array
  const propertyArray = [];
  for (let i = 0; i < compStyles.length; i++) {
    const property = compStyles[i];
    const value = compStyles.getPropertyValue(property);
    propertyArray.push(`${property}: ${value}`);
  }

  if (propertyArray.length > 0) {
    //close button 
    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", function () {
      clearPropertyList();
    });
    propertyList.appendChild(closeButton);

    // appending properties and their values to the div
    propertyArray.forEach((propertyValue) => {
      const listItem = document.createElement("div");
      listItem.textContent = propertyValue;
      propertyList.appendChild(listItem);
    });

    // Append the property list to body
    document.body.appendChild(propertyList);
    propertyList.style.display = "block";
  }
}

document.addEventListener("click", function (event) {
  if (extensionEnabled) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const element = event.target;

    if (event.target !== propertyList) {
      if (window.location.href.startsWith('http') || window.location.href.startsWith('https')) {
        createPropertyList();
        clearPropertyList();
        fetchCss(element, event);
      }
    }
  }
}, true);
