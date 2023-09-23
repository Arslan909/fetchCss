let extensionEnabled = false;

chrome.runtime.onMessage.addListener((message) => {
  if (message.enableScript) {
    extensionEnabled = message.enableScript;
  }
});



function fetchCss(element, event) {
  const propertyList = document.createElement("ul");
  propertyList.id = "property-list";
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


document.addEventListener("click", function (event) {
  if (extensionEnabled) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const element = event.target;

    // Check if the current URL starts with "http" or "https" to ensure it's a web page.
    if (window.location.href.startsWith('http') || window.location.href.startsWith('https')) {
      fetchCss(element, event);
    }
  }
}, true);