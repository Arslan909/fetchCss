chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: enableScript,
    });
  });
  
  function enableScript() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { enableScript: true });
    });
  }
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.popupChanged) {
      const checkboxState = message.popupChanged;
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { enableScript: checkboxState });
      });
    }
  });
  