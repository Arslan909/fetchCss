let extensionEnabled = false;
let propertyList = null; // This will hold the property list DIV element

chrome.runtime.onMessage.addListener((message) => {
  if (message.enableScript) {
    extensionEnabled = message.enableScript;
  }
});


// TODO- add search option for the properties list in the list div 
// - fix the copy to clip board button


// This will set the initial properties of a properties list DIV
function createPropertyList() {
  if (!propertyList) {
    propertyList = document.createElement("div");
    propertyList.id = "property-list";

    propertyList.style.position = "fixed";
    propertyList.style.backgroundColor = "#FAF1E4";
    propertyList.style.border = "1px solid #e0e0e0";
    propertyList.style.padding = "15px";
    propertyList.style.borderRadius = "5px";
    propertyList.style.boxShadow = "0px 2px 4px rgba(0, 0, 0, 0.2)";
    propertyList.style.width = "25%";
    propertyList.style.height = "50%";
    propertyList.style.overflowY = "scroll";
    propertyList.style.color = "#191717";
    propertyList.style.fontSize = "18px";
  }
}

function copyPropertiesToClipboard() {
  const propertiesText = Array.from(propertyList.querySelectorAll("div")).map((item) => item.textContent).join("\n");

  navigator.clipboard.writeText(propertiesText)
  .then(() => console.log("Copied to clipboard"))
  .catch(function (err) {console.error('Error copying text to clipboard: ', err);});
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
    // Close button
    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", function () {
      clearPropertyList();
    });
    propertyList.appendChild(closeButton);

    // Add a "Copy to Clipboard" button
    const copyButton = document.createElement("button");
    copyButton.textContent = "Copy to Clipboard";
    copyButton.addEventListener("click", function () {
      copyPropertiesToClipboard();
    });
    propertyList.appendChild(copyButton);

    // Appending properties and their values to the div
    propertyArray.forEach((propertyValue) => {
      const listItem = document.createElement("div");
      listItem.textContent = propertyValue;
      propertyList.appendChild(listItem);
    });

    // Append the property list to the body
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
      }a
    }
  }
}, true);
