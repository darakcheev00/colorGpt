
setCustomColorInStorage = async (index, newColor) => {
	if (index == 1) {
		await chrome.storage.local.set({ customColor1: newColor }, () => {
			console.log(`customColor1 saved in chrome storage ${newColor}`);
		});
	} else if (index == 2) {
		await chrome.storage.local.set({ customColor2: newColor }, () => {
			console.log(`customColor2 saved in chrome storage ${newColor}`);
		});
	} else if (index == 3) {
		await chrome.storage.local.set({ customColor3: newColor }, () => {
			console.log(`customColor3 saved in chrome storage ${newColor}`);
		});
	}
}

getCustomColorFromStorage = async (index) => {
	const key = `customColor${index}`;
	return new Promise((resolve) => {
		chrome.storage.local.get([key], (data) => {
			const customColor = data[key] || '#343541'; // Provide a default color if not found
			console.log(`Retrieved ${key} from storage: ${customColor}`);
			resolve(customColor);
		});
	});
};


setGPTColorInStorage = async (newColor) => {
	await chrome.storage.local.set({ gptColor: newColor }, () => {
		console.log(`New gpt background color saved in chrome storage ${newColor}`);
	});
};

getGPTColorFromStorage = async () => {
	return new Promise((resolve) => {
		chrome.storage.local.get(['gptColor'], (data) => {
			const gptColor = data.gptColor || '#343541'; // Provide a default color if not found
			console.log(`Retrieved gpt background color from storage: ${gptColor}`);
			resolve(gptColor);
		});
	});
};


const setColor = (newColor) => {
	const isDarkMode = document.documentElement.classList.contains('dark');

	if (isDarkMode) {
		var styleElementDark = document.createElement('style');
		styleElementDark.textContent = `:root.dark {
            --main-surface-primary: ${newColor};
        }`;
		document.head.appendChild(styleElementDark);
	} else {
		var styleElementLight = document.createElement('style');
		styleElementLight.textContent = `html {
										--main-surface-primary: ${newColor};
									}`;
		document.head.appendChild(styleElementLight);
	}
}

(async () => {
	const colorFromStorage = await getGPTColorFromStorage();
	setColor(colorFromStorage);

	chrome.runtime.onMessage.addListener(
		async function (request, sender, sendResponse) {
			if (request.action === 'changeColor') {
				console.log(`setting and saving background color:${request.color}`);
				setColor(request.color);
				await setGPTColorInStorage(request.color);
			} else if (request.action === 'saveCustomColor') {
				console.log(`saving custom color index:${request.customColorIndex}, color:${request.color}`);
				await setCustomColorInStorage(request.customColorIndex, request.color);
			}
		}
	);
})();

// original color
// #343541