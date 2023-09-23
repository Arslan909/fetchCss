const scriptCheckbox = document.getElementById('scriptCheckbox');
scriptCheckbox.addEventListener('change', () => {
  chrome.runtime.sendMessage({ popupChanged: scriptCheckbox.checked });
});
