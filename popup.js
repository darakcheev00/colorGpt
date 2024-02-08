document.addEventListener('DOMContentLoaded', async function () {
    // This ensures that the DOM is fully loaded before attempting to access elements
    
    // 1 ===================================================================
    var colorPicker1 = document.getElementById(`colorPicker1`);
    colorPicker1.value = await getCustomColorFromStorage(1);
    var changeColorBtn1 = document.getElementById(`changeColorBtn1`);

    if (changeColorBtn1) {
        changeColorBtn1.addEventListener('click', function () {
            var selectedColor = colorPicker1.value;
            console.log(`using custom color index: 1, color:${selectedColor}`);

            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'changeColor', color: selectedColor });
                chrome.tabs.sendMessage(tabs[0].id, { action: 'saveCustomColor', customColorIndex: 1, color: selectedColor });
            });
        });
    }

    // 2 ===================================================================
    var colorPicker2 = document.getElementById(`colorPicker2`);
    colorPicker2.value = await getCustomColorFromStorage(2);
    var changeColorBtn2 = document.getElementById(`changeColorBtn2`);

    if (changeColorBtn2) {
        changeColorBtn2.addEventListener('click', function () {
            var selectedColor = colorPicker2.value;
            console.log(`using custom color index: 2, color:${selectedColor}`);

            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'changeColor', color: selectedColor });
                chrome.tabs.sendMessage(tabs[0].id, { action: 'saveCustomColor', customColorIndex: 2, color: selectedColor });
            });
        });
    }


    // 3 ===================================================================
    var colorPicker3 = document.getElementById(`colorPicker3`);
    colorPicker3.value = await getCustomColorFromStorage(3);
    var changeColorBtn3 = document.getElementById(`changeColorBtn3`);

    if (changeColorBtn3) {
        changeColorBtn3.addEventListener('click', function () {
            var selectedColor = colorPicker3.value;
            console.log(`using custom color index: 3, color:${selectedColor}`);

            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'changeColor', color: selectedColor });
                chrome.tabs.sendMessage(tabs[0].id, { action: 'saveCustomColor', customColorIndex: 3, color: selectedColor });
            });
        });
    }


    // Function to set the color from a preset circle
    window.setPresetColor = function (color) {
        var formattedColor = rgbToHex(color);
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


getCustomColorFromStorage = async (index) => {
    const key = `customColor${index}`;
    return new Promise((resolve) => {
        chrome.storage.local.get([key], (data) => {
            console.log(data);
            const customColor = data[key] || '#000000'; // Provide a default color if not found
            console.log(`Retrieved ${key} from storage: ${customColor}`);
            resolve(customColor);
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