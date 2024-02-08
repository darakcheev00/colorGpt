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

  // Function to set the color from a preset circle
  window.setPresetColor = function (color) {
    var formattedColor = rgbToHex(color);
    console.log(`the color: ${formattedColor}`);
    colorPicker.value = formattedColor;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'changeColor', color: formattedColor });
    });
  };

  // Add event listeners to the color circles dynamically
  var colorCircles = document.getElementById('colorCircles');
  colorCircles.addEventListener('click', function (event) {
    var target = event.target;
    if (target.classList.contains('color-circle')) {
      var chosenColor = target.style.backgroundColor;
      console.log(`chosen color: ${chosenColor}`);
      setPresetColor(chosenColor);
    }
  });
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

function rgbToHex(rgb) {
  // Convert the RGB color to hex format
  var match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!match) {
    return rgb; // Return original color if not in RGB format
  }
  var hex = '#' + ('0' + parseInt(match[1], 10).toString(16)).slice(-2) +
             ('0' + parseInt(match[2], 10).toString(16)).slice(-2) +
             ('0' + parseInt(match[3], 10).toString(16)).slice(-2);
  return hex;
}