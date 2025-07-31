const INITIAL_LOAD_COUNT = 20;
let currentIndex = 0;
let allColorData = [];
let bestOfColorData = [];
let shortColorData = [];
let currentColorData = [];
let filteredColorData = []; // Store current filtered results
let currentFilter = 'all';
let isFiltering = false; // Track if we're in a filtered state
let heroDisplayed = false; // Track if hero palette has been displayed

// Fetch all three datasets
Promise.all([
    fetch('dist/colornames.json').then(response => response.json()),
    fetch('dist/colornames.bestof.json').then(response => response.json()),
    fetch('dist/colornames.short.json').then(response => response.json())
])
.then(([allData, bestOfData, shortData]) => {
    allColorData = shuffleArray(allData);
    bestOfColorData = shuffleArray(bestOfData);
    shortColorData = shuffleArray(shortData);
    
    // Set initial data based on current filter
    currentColorData = allColorData;
    currentIndex = INITIAL_LOAD_COUNT;
    displayColors(currentColorData.slice(0, INITIAL_LOAD_COUNT));
    setupInfiniteScroll();
})
.catch(error => console.error('Error fetching color data:', error));

// Function to set filter type
function setFilter(filterType) {
    isFiltering = false;
    currentFilter = filterType;
    heroDisplayed = false; // Reset hero display flag
    
    // Update button states
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('filter-' + filterType).classList.add('active');
    
    // Set the appropriate data source
    switch(filterType) {
        case 'all':
            currentColorData = allColorData;
            break;
        case 'best':
            currentColorData = bestOfColorData;
            break;
        case 'short':
            currentColorData = shortColorData;
            break;
    }
    
    // Reset and display colors
    currentIndex = INITIAL_LOAD_COUNT;
    displayColors(currentColorData.slice(0, INITIAL_LOAD_COUNT));
}

// Function to show shades of the selected color
function showShades(baseColor) {
    isFiltering = true;
    heroDisplayed = false; // Reset hero display flag
    // More accurate color filtering
    const colorKeywords = {
        'red': ['red', 'crimson', 'scarlet', 'cherry', 'rose', 'ruby', 'burgundy', 'maroon', 'coral', 'salmon', 'pink'],
        'orange': ['orange', 'amber', 'tangerine', 'peach', 'apricot', 'coral', 'rust', 'copper', 'bronze'],
        'yellow': ['yellow', 'gold', 'lemon', 'cream', 'ivory', 'wheat', 'honey', 'butter', 'champagne', 'blonde'],
        'green': ['green', 'lime', 'mint', 'sage', 'olive', 'forest', 'emerald', 'jade', 'teal', 'pine', 'moss'],
        'blue': ['blue', 'azure', 'navy', 'royal', 'sky', 'ocean', 'sapphire', 'cobalt', 'steel', 'powder', 'cyan'],
        'indigo': ['indigo', 'purple', 'violet', 'plum', 'grape', 'lavender', 'amethyst', 'orchid'],
        'violet': ['violet', 'purple', 'plum', 'grape', 'lavender', 'amethyst', 'orchid', 'magenta', 'fuchsia'],
        'purple': ['purple', 'violet', 'plum', 'grape', 'lavender', 'amethyst', 'orchid', 'magenta', 'fuchsia', 'indigo'],
        'pink': ['pink', 'rose', 'blush', 'salmon', 'coral', 'fuchsia', 'magenta', 'rouge'],
        'brown': ['brown', 'tan', 'beige', 'coffee', 'chocolate', 'chestnut', 'mahogany', 'sienna', 'umber'],
        'gray': ['gray', 'grey', 'silver', 'charcoal', 'slate', 'ash', 'steel', 'pewter', 'smoke'],
        'black': ['black', 'charcoal', 'ebony', 'jet', 'coal', 'onyx', 'obsidian'],
        'white': ['white', 'ivory', 'cream', 'pearl', 'snow', 'milk', 'vanilla', 'alabaster']
    };
    
    const keywords = colorKeywords[baseColor.toLowerCase()] || [baseColor.toLowerCase()];
    
    // Filter colors that contain any of the keywords
    filteredColorData = currentColorData.filter(color => {
        const colorName = color.name.toLowerCase();
        return keywords.some(keyword => colorName.includes(keyword));
    });

    document.getElementById('main-container').innerHTML = '';  // Clear previous colors
    currentIndex = INITIAL_LOAD_COUNT;
    displayColors(filteredColorData.slice(0, INITIAL_LOAD_COUNT));
}

// Function to reset to current filter view
function resetToCurrentFilter() {
    isFiltering = false;
    heroDisplayed = false; // Reset hero display flag
    currentIndex = INITIAL_LOAD_COUNT;
    displayColors(currentColorData.slice(0, INITIAL_LOAD_COUNT));
    
    // Clear search bar
    document.getElementById('search-bar').value = '';
}

// Hex to RGB conversion utility
function hexToRGB(hex) {
    let parsedHex = hex.replace('#', '');
    if (parsedHex.length === 3) {
        parsedHex = parsedHex.split('').map(c => c + c).join('');
    }
    const bigint = parseInt(parsedHex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgb(${r}, ${g}, ${b})`;
}

// Function to display colors (used both to show all colors by default and filtered results)
function displayColors(colors, append = false) {
    const paletteContainer = document.getElementById('main-container');
    if (!append) {
        paletteContainer.innerHTML = '';  // Clear only if not appending
        
        // Move hero_palette into main-container as first item if not already there
        if (!heroDisplayed) {
            const heroElement = document.querySelector('.hero_pallete');
            if (heroElement) {
                // Clone the hero element to avoid moving it from its original position
                const heroClone = heroElement.cloneNode(true);
                paletteContainer.appendChild(heroClone);
                heroDisplayed = true;
            }
        }
    }

    colors.forEach(color => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'frosted_texture frosted_background';

        const colorDiv = document.createElement('div');
        colorDiv.className = `color-item ${color.name}`;
        colorDiv.style.background = color.hex;
        colorDiv.id = "color-pallete";

        const infoDiv = document.createElement('div');
        infoDiv.id = 'info';
        const nameDiv = document.createElement('div');
        nameDiv.id = 'name';
        nameDiv.textContent = color.name;

        const hexDiv = document.createElement('div');
        hexDiv.id = 'hex';
        hexDiv.className = 'copyable';
        hexDiv.textContent = color.hex;

        const hexCopyBtn = document.createElement('button');
        hexCopyBtn.textContent = 'Copy Hex';
        hexCopyBtn.className = 'copy-btn frosted_background frosted_texture';
        hexCopyBtn.onclick = () => {
            navigator.clipboard.writeText(color.hex);
            hexCopyBtn.textContent = 'Copied!';
            setTimeout(() => hexCopyBtn.textContent = 'Copy Hex', 1000);
        };

        const rgb = hexToRGB(color.hex);
        const rgbDiv = document.createElement('div');
        rgbDiv.id = 'rgb';
        rgbDiv.className = 'copyable';
        rgbDiv.textContent = rgb;

        const rgbCopyBtn = document.createElement('button');
        rgbCopyBtn.textContent = 'Copy RGB';
        rgbCopyBtn.className = 'copy-btn frosted_background frosted_texture';
        rgbCopyBtn.onclick = () => {
            navigator.clipboard.writeText(rgb);
            rgbCopyBtn.textContent = 'Copied!';
            setTimeout(() => rgbCopyBtn.textContent = 'Copy RGB', 1000);
        };

        infoDiv.appendChild(nameDiv);
        infoDiv.appendChild(hexDiv);
        infoDiv.appendChild(hexCopyBtn);
        infoDiv.appendChild(rgbDiv);
        infoDiv.appendChild(rgbCopyBtn);

        entryDiv.appendChild(colorDiv);
        entryDiv.appendChild(infoDiv);
        paletteContainer.appendChild(entryDiv);
    });
}
// Function to search colors by name or hex
function searchColors() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    
    if (query) {
        isFiltering = true;
        filteredColorData = currentColorData.filter(color => 
            color.name.toLowerCase().includes(query) || color.hex.toLowerCase().includes(query)
        );
    } else {
        isFiltering = false;
        filteredColorData = [];
    }
    
    currentIndex = INITIAL_LOAD_COUNT;
    const dataToDisplay = isFiltering ? filteredColorData : currentColorData;
    displayColors(dataToDisplay.slice(0, INITIAL_LOAD_COUNT));
}

// Fisher-Yates Shuffle Algorithm to randomize the colors array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));  // Pick a random index
        [array[i], array[j]] = [array[j], array[i]];  // Swap elements
    }
    return array;
}

function loadMoreColors() {
    const dataToLoad = isFiltering ? filteredColorData : currentColorData;
    if (currentIndex >= dataToLoad.length) return; // No more colors to load
    
    const nextColors = dataToLoad.slice(currentIndex, currentIndex + INITIAL_LOAD_COUNT);
    displayColors(nextColors, true);
    currentIndex += INITIAL_LOAD_COUNT;
}

function setupInfiniteScroll() {
    window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            loadMoreColors();
        }
    });
}
