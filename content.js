
setGPTColorInStorage = async (newColor) => {
    await chrome.storage.local.set({ gptColor: newColor }, () => {
        console.log(`New gpt background color saved in chrome storage ${newColor}`);
    });
};

getGPTColorFromStorage = async () => {
    return new Promise((resolve) => {
        chrome.storage.local.get(['gptColor'], (data) => {
            const gptColor = data.gptColor || '#355751'; // Provide a default color if not found
            console.log(`Retrieved gpt background color from storage: ${gptColor}`);
            resolve(gptColor);
        });
    });
};


const setColor = (newColor) => {
    var styleElement = document.createElement('style');

    styleElement.textContent = `
            :root.dark {
                --main-surface-primary: ${newColor};
            }
            `;

    document.head.appendChild(styleElement);
}

(async () => {
    const colorFromStorage = await getGPTColorFromStorage();
    setColor(colorFromStorage);

    chrome.runtime.onMessage.addListener(
        async function (request, sender, sendResponse) {
            if (request.action === 'changeColor') {
                setColor(request.color);
                await setGPTColorInStorage(request.color);
            }
        }
    );
})();



// original color
// #343541