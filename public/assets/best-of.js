const INITIAL_LOAD_COUNT = 20;
let currentIndex = 0;
let colorData = [];

// Fetch and load all color data from dist/colornames.json
fetch('../dist/colornames.bestof.json')
    .then(response => response.json())
    .then(data => {
        colorData = shuffleArray(data);
        currentIndex = INITIAL_LOAD_COUNT;
        displayColors(colorData.slice(0, INITIAL_LOAD_COUNT));
        setupInfiniteScroll();  // Attach scroll listener
    })
    .catch(error => console.error('Error fetching color data:', error));

// Function to show shades of the selected color
function showShades(baseColor) {
    // Filter the colorData array to get shades of the selected base color
    const shades = colorData.filter(color => color.name.toLowerCase().includes(baseColor.toLowerCase()));

    document.getElementById('main-container').innerHTML = '';  // Clear previous colors
    displayColors(shades);  // Display the shades of the selected color
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
    if (!append) paletteContainer.innerHTML = '';  // Clear only if not appending

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
    const filteredColors = colorData.filter(color =>
        color.name.toLowerCase().includes(query) || color.hex.toLowerCase().includes(query)
    );
    currentIndex = filteredColors.length;
    document.getElementById('main-container').innerHTML = '';
    displayColors(filteredColors);
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
    const nextColors = colorData.slice(currentIndex, currentIndex + INITIAL_LOAD_COUNT);
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