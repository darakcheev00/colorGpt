document.addEventListener('DOMContentLoaded', async function () {
  // This ensures that the DOM is fully loaded before attempting to access elements

  // Get the color picker element
  var colorPicker = document.getElementById('colorPicker');
  const defaultColor = await getGPTColorFromStorage();
  colorPicker.value = defaultColor;

  // Get the change color button element
  var changeColorBtn = document.getElementById('changeColorBtn');

  // Add event listener only if the elements are found
  if (changeColorBtn) {
    changeColorBtn.addEventListener('click', function () {
      // Get the selected color from the color picker
      var selectedColor = colorPicker.value;
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // Send the selected color to the content script
        chrome.tabs.sendMessage(tabs[0].id, { action: 'changeColor', color: selectedColor });
      });
    });
  }

  window.setPresetColor = function(color) {
    colorPicker.value = color;
    console.log(`new color: ${color}`);

    // Move chrome.tabs.query inside the setPresetColor function
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'changeColor', color: color });
    });
  };
});


getGPTColorFromStorage = async () => {
  return new Promise((resolve) => {
      chrome.storage.local.get(['gptColor'], (data) => {
          const gptColor = data.gptColor || '#343541'; // Provide a default color if not found
          console.log(`Retrieved gpt background color from storage: ${gptColor}`);
          resolve(gptColor);
      });
  });
};
