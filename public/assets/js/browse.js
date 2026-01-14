import { liosRandomizeArray } from "../../LiOS-Web-Utils/liosWebUtils.js";
import { containerAddButtons, generatePalettes } from "./tools/generatePalettes.js";
import { searchHandler } from "./tools/searchHandler.js";
import { colorConvertor } from "./tools/colorConvertor.js";
import { metadata, parseMetadata } from "./metadata.js";
import { liosWindow } from "../../LiOS-Open/public/modules/JS/liosOpen.js";

const main = async () => {
    const colorsFile = await fetch("https://data.colors.liosorg.com/colornames.json");
    const colorsData = await colorsFile.json();
    const randomizedColorsData = liosRandomizeArray(colorsData);
    const scrollToTopPebble = document.querySelector(".scroll-to-top-pebble");
    let palettesContainer = document.querySelector(".palettes-container");

    
    let startingIndex = 0;
    let endingIndex = 20;
    // Save Palettes
        const savePalettesContainer = async () => {
        savePalettesContainerData = palettesContainer.cloneNode(true);
        saveStartingIndex = startingIndex;
        saveEndingIndex = endingIndex;
        saveScrollPosition = window.scrollY;
    };
    // 
    // Palettes Generation
    generatePalettes(randomizedColorsData.slice(0, 20), palettesContainer);
    const infiniteScroll = async () => {
        if (startingIndex >= randomizedColorsData.length) return;
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            startingIndex += 20;
            endingIndex += 20;
            generatePalettes(randomizedColorsData.slice(startingIndex, endingIndex), palettesContainer);
        };
    };
    window.addEventListener("scroll", infiniteScroll);
    window.addEventListener("scroll", savePalettesContainer);
    // 
    // Scroll to top
    window.addEventListener("scroll", () => {
        const threshold = window.innerHeight * 0.8;
        if (window.scrollY > threshold ) {
            scrollToTopPebble.style.display = "flex";
        } else if (window.screenY <= threshold) {
            scrollToTopPebble.style.display = "none";
        };
    });
    scrollToTopPebble.addEventListener("click", () => {
        window.scrollTo({
            top: "0%",
            behavior: "smooth"
        });
        scrollToTopPebble.style.display = "none"
    });
    // 
    // Search Funtionality
    const searchBar = document.querySelector(".search-bar")
    let savePalettesContainerData;
    let saveStartingIndex;
    let saveEndingIndex;
    let saveScrollPosition;
    let infiniteScrollSearch;
    const resetPebble = document.querySelector(".reset-pebble");
    savePalettesContainer();
    searchBar.addEventListener("input", async () => {
        window.removeEventListener("scroll", infiniteScroll);
        window.removeEventListener("scroll", savePalettesContainer);
        startingIndex = 0;
        endingIndex = 20;
        const searchInput = searchBar.value;
        if (!searchInput) {
            resetPalettes();
            return;
        };
        const searchData = searchHandler(searchInput, colorsData);
        window.scrollTo({
            top: 0,
            behavior: "auto"
        });
        palettesContainer.innerHTML = "";

        generatePalettes(searchData.slice(0, 20), palettesContainer);
        if (searchData.length <= 0) {
            palettesContainer.innerHTML = //html
                `
                <div>No colors found</div>
            `;
        }
        infiniteScrollSearch = async () => {
            if (startingIndex >= searchData.length) return;
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
                startingIndex += 20;
                endingIndex += 20;
                generatePalettes(searchData.slice(startingIndex, endingIndex), palettesContainer);
                await savePalettesContainer()
            };
        };
        window.addEventListener("scroll", infiniteScrollSearch);
        resetPebble.style.display = "flex";
    });
    resetPebble.addEventListener("click", () => {
        resetPalettes()
    });
    const resetPalettes = async () => {
        const restoreDOM = async () => {
            palettesContainer.replaceWith(savePalettesContainerData);
            palettesContainer = document.querySelector(".palettes-container");
            containerAddButtons(palettesContainer);
        };
        await restoreDOM();
        searchBar.value = "";
        startingIndex = saveStartingIndex;
        endingIndex = saveEndingIndex;
        window.removeEventListener("scroll", infiniteScrollSearch);
        window.addEventListener("scroll", infiniteScroll);
        window.addEventListener("scroll", savePalettesContainer);
        window.scrollTo({
            top: saveScrollPosition,
            behavior: "smooth"
        });
        resetPebble.style.display = "none";
    };
    // 
    // About Window
    await parseMetadata()
    const licenseContainer = document.createElement("div");
    licenseContainer.classList.add("license-container");
    metadata.licenses.forEach(license => {
        const licenceFor = license.for;
        const name = license.license;
        const url = license.copy;
        const licenseWrapper = document.createElement("a");
        licenseWrapper.classList.add("lios-window-value-row");
        licenseWrapper.innerHTML = //html
            `
            <span class="key">${licenceFor}</span><span class="value">${name}</span>
        `;
        licenseWrapper.href = url;
        licenseContainer.appendChild(licenseWrapper);
    });
    const aboutWindow = await liosWindow.new();
    aboutWindow.setId("About");
    aboutWindow.setTitle("About");
    aboutWindow.applyEffect.frostedGlass();
    const aboutWindowContent =//html
        `
                    <img src="/assets/favicon/favicon.svg" alt="LiOS:Colors" class="about-window-favicon">
                    <div class="lios-window-header project-name">${metadata.projectName}</div>
                    <hr>
                    <p>${metadata.projectDescription}</p>
                      <div class="lios-window-card frosted_background">
                        <div class="lios-window-container-title">General Information</div>
                        <a class="lios-window-value-row project-version-release-notes"><span class="key">Version</span><span class="value project-version">${metadata.projectVersion}</span></a>
                        <div class="lios-window-value-row"><span class="key">Version name</span><span class="value version-name">${metadata.versionName}</span></div>
                        <div class="lios-window-value-row"><span class="key">Channel</span><span class="value project-channel">${metadata.channel}</span></div>
                        <div class="lios-window-value-row"><span class="key">LiOS-Open Version</span><span class="value">Unreleased, rolling</span></div>
                      </div>
                      <div class="lios-window-card frosted_background">
                        <div class="lios-window-container-title">License Information</div>
                        ${licenseContainer.innerHTML}
                      </div>

    `;
    aboutWindow.setContents(aboutWindowContent);
    aboutWindow.selectTriggerButton(".info-pebble");
    // 

};
const hideLoader = (async () => {
    const loader = document.querySelector(".hero-loader");

    await main();

    loader.parentElement.removeChild(loader);
})();