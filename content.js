let extensionEnabled = false;
let propertyList = null;

chrome.runtime.onMessage.addListener((message) => {
  if (message.enableScript) {
    extensionEnabled = message.enableScript;
  }
});

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

    // Prevent click events on the property list and its content
    propertyList.addEventListener("click", function (event) {
      event.stopPropagation();
    });
  }
}

function clearPropertyList() {
  if (propertyList) {
    propertyList.textContent = '';
    // Hide the property list after clearing
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
    // Add a close button if there are properties
    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", function () {
      clearPropertyList();
    });
    propertyList.appendChild(closeButton);

    // Append the properties and values
    propertyArray.forEach((propertyValue) => {
      const listItem = document.createElement("div");
      listItem.textContent = propertyValue;
      propertyList.appendChild(listItem);
    });

    // Append the property list to the document body
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
