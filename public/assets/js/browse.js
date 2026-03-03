import { metadata } from "./metadata.js";
import { liosOpen } from "../../LiOS-Open/liosOpen.js";
import { initShades } from "./tools/shades.js";
import { webUtils } from "../../LiOS-Web-Utils/liosWebUtils.js";
import { generatePalettes } from "./palettes.js";
// Global Variables
let fragments;
let palettesContainer;
let palettesContainerStateManager;
let pickFromBag;
const loader = document.querySelector(".hero-loader");
const scrollToTop = document.querySelector(".scroll-to-top-pebble");
let infiniteScrollLogic;
// 
// Main Function
const main = async () => {
    const manifestFile = await fetch("https://data.colors.liosorg.com/colors/manifest.json");
    const manifest = await manifestFile.json();
    let excludeFragments = [];

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
            if (excludeFragments.includes(fragment)) {
                continue;
            }
            const dataURL = `${fragmentsURL}fragment-${[String(fragment)]}.json`;
            const dataFile = await fetch(dataURL);
            const dataJson = await dataFile.json();
            const randomizedData = webUtils.array.randomize(dataJson);

            await generatePalettes(randomizedData, "root");
        };
        batch.forEach((fragment => {
            excludeFragments.push(fragment);
        }));
    };
    await initializeFirstBatch();
    // 
    // Infinite Scroll
    infiniteScrollLogic = async () => {
        const viewportHeight = window.innerHeight;
        const scrollHeight = document.documentElement.scrollHeight;

        if (window.scrollY + viewportHeight >= scrollHeight - 100) {
            const batchSize = 2;
            const batch = [];
            if (batch.length >= totalFragments) {
                window.removeEventListener("scroll", infiniteScrollLogic);
                return;
            }
            for (let i = 0; i < batchSize; i++) {
                batch.push(pickFromBag());
            }
            window.removeEventListener("scroll", infiniteScrollLogic);

            loader.style.display = "flex";

            for (const fragment of batch) {
                if (fragment === 0 || fragment === undefined || fragment === null) {
                    continue;
                };
                const colorFile = await fetch(`https://data.colors.liosorg.com/colors/fragment-${String(fragment)}.json`);
                const colorData = await colorFile.json()
                const randomizedColorData = webUtils.array.randomize(colorData);
                
                await generatePalettes(randomizedColorData, "root", "default");
                palettesContainer.update();
            };

            loader.style.display = "none";

            window.addEventListener("scroll", infiniteScrollLogic);
        };
    };
    window.addEventListener("scroll", infiniteScrollLogic);

    palettesContainer.render();
    // 
    // Shades filter on Scroll
    const shadesFilter = document.querySelector(".browse-shades-filter");
    window.addEventListener("scroll", () => {
        if (window.scrollY >= 200) {
            shadesFilter.classList.add("browse-shades-filter-retracted");
        } else {
            shadesFilter.classList.remove("browse-shades-filter-retracted");
        }
    });
    // 

    // Init Shades Filter
    await initShades();
    // 
    // Reset Button
    const resetButton = document.querySelector(".reset-pebble");
    resetButton.addEventListener("click", async () => {
        await palettesContainerStateManager.switchState("default");
        window.addEventListener("scroll", infiniteScrollLogic);
        resetButton.style.display = "none";
    });
    // 
    // Window (About)
    const aboutWindow = await liosOpen.window.new();
    aboutWindow.applyEffect.frostedGlass();
    aboutWindow.setId("About");
    aboutWindow.setTitle("About");

    const aboutWindowContents = await aboutWindow.getController();

    const favicon = await aboutWindowContents.newChild("img");
    favicon.attributes(
        {
            "style": `
                size: 1/1;
                width: 20vw;
                display: flex;
                justify-self: center;
                margin-top: 15px;
            `,
            "src": metadata.favicon
        }
    );
    favicon.appendTo("root");

    const heading = await aboutWindowContents.newChild("h2");
    heading.textContent(metadata.projectName);
    heading.attributes({
        "style": `
            text-align: center;
        `
    });
    heading.appendTo("root");

    const aboutHr1 = await aboutWindowContents.newChild("hr");
    aboutHr1.appendTo("root");

    const description = await aboutWindowContents.newChild("p");
    description.textContent(metadata.projectDescription);
    description.attributes({
        "style": `
            text-align: center;
            text-wrap: wrap;
        `
    });
    description.appendTo("root");
    
    // General Information (About Window)
    const generalInformation = await aboutWindowContents.newChild();
    generalInformation.classList("lios-window-card", "lios-frosted-glass");

    const generalInformationTitle = await aboutWindowContents.newChild();
    generalInformationTitle.classList("lios-window-container-title");
    generalInformationTitle.textContent("General Information");
    generalInformationTitle.appendTo(generalInformation);

    const projectVersion = await aboutWindowContents.newChild("a");
    projectVersion.classList("lios-window-value-row");

    const projectVersionKey = await aboutWindowContents.newChild("span");
    projectVersionKey.classList("key");
    projectVersionKey.textContent("Version");
    projectVersionKey.appendTo(projectVersion);

    const projectVersionValue = await aboutWindowContents.newChild("span");
    projectVersionValue.classList("key");
    projectVersionValue.textContent(metadata.projectVersion);
    projectVersionValue.appendTo(projectVersion);

    projectVersion.appendTo(generalInformation);

    const projectVersionName = await aboutWindowContents.newChild("a");
    projectVersionName.classList("lios-window-value-row");

    const projectVersionNameKey = await aboutWindowContents.newChild("span");
    projectVersionNameKey.classList("key");
    projectVersionNameKey.textContent("Version Name");
    projectVersionNameKey.appendTo(projectVersionName);

    const projectVersionNameValue = await aboutWindowContents.newChild("span");
    projectVersionNameValue.classList("key");
    projectVersionNameValue.textContent(metadata.versionName);
    projectVersionNameValue.appendTo(projectVersionName);

    projectVersionName.appendTo(generalInformation);

    const projectChannel = await aboutWindowContents.newChild("a");
    projectChannel.classList("lios-window-value-row");

    const projectChanelKey = await aboutWindowContents.newChild("span");
    projectChanelKey.classList("key");
    projectChanelKey.textContent("Channel");
    projectChanelKey.appendTo(projectChannel);

    const projectChannelValue = await aboutWindowContents.newChild("span");
    projectChannelValue.classList("key");
    projectChannelValue.textContent(metadata.channel);
    projectChannelValue.appendTo(projectChannel);

    projectChannel.appendTo(generalInformation);

    const liosOpenVersion = await aboutWindowContents.newChild("a");
    liosOpenVersion.classList("lios-window-value-row");

    const liosOpenVersionKey = await aboutWindowContents.newChild("span");
    liosOpenVersionKey.classList("key");
    liosOpenVersionKey.textContent("LiOS-Open Version");
    liosOpenVersionKey.appendTo(liosOpenVersion);

    const liosOpenVersionValue = await aboutWindowContents.newChild("span");
    liosOpenVersionValue.classList("key");
    liosOpenVersionValue.textContent("Unreleased,rolling");
    liosOpenVersionValue.appendTo(liosOpenVersion);

    liosOpenVersion.appendTo(generalInformation);
    generalInformation.appendTo("root");
    // 

    // Licensing Information (About Window)
    const licensingInformation = await aboutWindowContents.newChild();
    licensingInformation.classList("lios-window-card", "lios-frosted-glass");

    const licensingInformationTitle = await aboutWindowContents.newChild();
    licensingInformationTitle.classList("lios-window-container-title");
    licensingInformationTitle.textContent("License Information");
    licensingInformationTitle.appendTo(licensingInformation);

    for (const license of metadata.licenses) {
        const keyValue = await aboutWindowContents.newChild("a");
        keyValue.classList("lios-window-value-row");
        keyValue.attributes({
            "href":license.copy
        });

        const key = await aboutWindowContents.newChild("span");
        key.classList("key");
        key.textContent(license.for);
        key.appendTo(keyValue);

        const value = await aboutWindowContents.newChild("span");
        value.classList("key");
        value.textContent(license.license);
        value.appendTo(keyValue);

        keyValue.appendTo(licensingInformation);
    };

    licensingInformation.appendTo("root");
    // 

    aboutWindowContents.render();

    const aboutButton = document.querySelector(".info-pebble");
    aboutButton.addEventListener("click", () => {
        aboutWindow.open();
    });
    
    // 
};
// 
// Loader
const hideLoader = (async () => {

    await main();
    loader.style.display = "none";
});
// 
// Scroll To Top
window.addEventListener("scroll", () => {
    if (window.scrollY >= "1000") {
        scrollToTop.style.display = "flex";
    } else if (window.screenY < "1000") {
        scrollToTop.style.display = "none";
    };
});
scrollToTop.addEventListener("click", () => {
    window.scroll({
        top: "100px",
        behavior: "smooth",
    });
});
// 
await hideLoader();
// Exports
export { fragments, palettesContainer, palettesContainerStateManager, pickFromBag, infiniteScrollLogic };
// 
