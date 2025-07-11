const INITIAL_LOAD_COUNT = 20;
let currentIndex = 0;
let colorData = [];

// Fetch and load all color data from dist/colornames.json
fetch('dist/colornames.json')
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

// Function to display colors (used both to show all colors by default and filtered results)
function displayColors(colors, append = false) {
    const paletteContainer = document.getElementById('main-container');
    if (!append) paletteContainer.innerHTML = '';  // Clear only if not appending

    colors.forEach(color => {
        const entryDiv = document.createElement('div');
        entryDiv.id = 'Frosted_Background';
        entryDiv.className = 'frosted_texture';

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
        hexDiv.textContent = color.hex;
        

        infoDiv.appendChild(nameDiv);
        infoDiv.appendChild(hexDiv);

        // Add a copy button for the hex value
        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy';
        copyBtn.className = 'copy-btn frosted_background frosted_texture';
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(color.hex);
            copyBtn.textContent = 'Copied!';
            setTimeout(() => copyBtn.textContent = 'Copy', 1000);
        };
        infoDiv.appendChild(copyBtn);

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