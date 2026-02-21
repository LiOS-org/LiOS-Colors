import { metadata, parseMetadata } from "./metadata.js";
import { liosOpen } from "../../LiOS-Open/liosOpen.js";
import { initShades } from "./tools/shades.js";
import { webUtils } from "../../LiOS-Web-Utils/liosWebUtils.js";
import { generatePalettes } from "./palettes.js";
// Global Variables
let fragments;
let palettesContainer;
let palettesContainerStateManager;
let pickFromBag;
// 
// Main Function
const main = async () => {
    const manifestFile = await fetch("https://data.colors.liosorg.com/colors/manifest.json");
    const manifest = await manifestFile.json();

    palettesContainer = await liosOpen.virtualDom.new();
    palettesContainer.select(".palettes-container");
    palettesContainerStateManager = palettesContainer.enableMultiState();

    const totalFragments = manifest.meta.totalFragments;
    fragments = manifest.fragments;
    const availableFragmentsArray = [];
    for (let i = 0; i < totalFragments; i++) {
        availableFragmentsArray.push(i);
    };
    // Some important functions
    pickFromBag = () => {
        const randomPos = Math.floor(Math.random() * availableFragmentsArray.length);
        const fragmentIndex = availableFragmentsArray[randomPos];

        // remove from bag
        availableFragmentsArray.splice(randomPos, 1);

        return fragmentIndex;
    };
    // 
    // Default State
    const initializeFirstBatch = async () => {
        const batchSize = 2;
        const batch = [];
        for (let i = 0; i < batchSize; i++) {
            batch.push(pickFromBag());
        };
        const fragmentsURL = "https://data.colors.liosorg.com/colors/";
        for (const fragment of batch) {
            const dataURL = `${fragmentsURL}fragment-${[String(fragment)]}.json`;
            const dataFile = await fetch(dataURL);
            const dataJson = await dataFile.json();
            const randomizedData = webUtils.array.randomize(dataJson);

            await generatePalettes(randomizedData,"root");
        };
    };
    await initializeFirstBatch();
    // 

    window.addEventListener("scroll", async () => {
        const viewportHeight = window.innerHeight;
        const scrollHeight = document.documentElement.scrollHeight;

        if (window.scrollY + viewportHeight >= scrollHeight - 100) {
            const batchSize = 2;
            const batch = [];
            for (let i = 0; i < batchSize; i++) {
                batch.push(pickFromBag());
            }

            // Implement virtualDom.update() first 
            // await generatePalettes(batch);
        };
    });

    palettesContainer.render();
    // Init Shades Filter
    await initShades();
    // 
    // Reset Button
    const resetButton = document.querySelector(".reset-pebble");
    resetButton.addEventListener("click", () => {
        palettesContainerStateManager.switchState("default");
        palettesContainer.render();
        resetButton.style.display = "none";
    });
    // 
};
// 
// Loader
const hideLoader = (async () => {
    const loader = document.querySelector(".hero-loader");

    await main();

    loader.parentElement.removeChild(loader);
});
// 
await hideLoader();
// Exports
export { fragments, palettesContainer, palettesContainerStateManager, pickFromBag };
// 